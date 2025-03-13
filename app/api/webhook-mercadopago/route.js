// app/api/webhook-mercadopago/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const parsedData = await req.json();
        console.log('Webhook data:', JSON.stringify(parsedData, null, 2)); // Log detallado del cuerpo

        if (parsedData.type === 'payment') {
            const paymentId = parsedData.data.id;
            console.log('Payment ID:', paymentId);

            // Obtener detalles del pago desde Mercado Pago API
            const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
            const paymentDetailsResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!paymentDetailsResponse.ok) {
                console.error('Error al obtener detalles del pago de Mercado Pago:', paymentDetailsResponse.status, paymentDetailsResponse.statusText);
                return NextResponse.json({ error: 'Error al obtener detalles del pago' }, { status: 500 });
            }

            const paymentDetails = await paymentDetailsResponse.json();
            console.log('Payment details:', JSON.stringify(paymentDetails, null, 2)); // Log detallado de los detalles del pago

            if (paymentDetails.status === 'approved') {
                // Obtener el ID del pedido desde la metadata de Mercado Pago
                const orderId = paymentDetails.metadata.order_id;
                console.log('Order ID from metadata:', orderId);
                console.log('Payment details.metadata:', JSON.stringify(paymentDetails.metadata)); // log de metadata

                if (!orderId) {
                    console.error('Order ID no encontrado en metadata');
                    return NextResponse.json({ error: 'Order ID no encontrado' }, { status: 400 });
                }

                // Actualizar el estado del pedido en la base de datos
                const client = await clientPromise;
                const db = client.db('pizzas_jai');
                const collection = db.collection('pedidos');

                console.log('Conexión a MongoDB establecida'); // Log de conexión

                const updateResult = await collection.updateOne(
                    { _id: new ObjectId(orderId) },
                    { $set: { pagado: true } }
                );

                console.log('Update Result:', JSON.stringify(updateResult, null, 2)); // Log detallado del resultado de la actualización

                if (updateResult.modifiedCount === 0) {
                    console.error('Pedido no encontrado o ya actualizado');
                    return NextResponse.json({ error: 'Pedido no encontrado o ya actualizado' }, { status: 404 });
                }

                console.log('Pedido actualizado a pagado');

                // Obtener detalles del pedido para enviar el correo electrónico
                const pedido = await collection.findOne({ _id: new ObjectId(orderId) });

                if (!pedido) {
                    console.error('Pedido no encontrado para enviar correo');
                    return NextResponse.json({ error: 'Pedido no encontrado para enviar correo' }, { status: 404 });
                }

                console.log('Detalles del pedido para correo electrónico:', JSON.stringify(pedido, null, 2)); // Log detallado del pedido

                // Enviar correo electrónico al usuario
                try {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,
                        },
                    });

                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: pedido.usuario.email,
                        subject: 'Tu pago ha sido aprobado',
                        text: `
                            Tu pago ha sido aprobado. Aquí están los detalles de tu pedido:

                            Pedido ID: ${pedido._id}
                            Usuario: ${pedido.usuario.nombre}
                            Email: ${pedido.usuario.email}
                            Items: ${JSON.stringify(pedido.items, null, 2)}
                            Total: ${pedido.total}
                            Pagado: Sí
                        `,
                    };

                    await transporter.sendMail(mailOptions);
                    console.log('Correo electrónico enviado al usuario');
                } catch (emailError) {
                    console.error('Error al enviar el correo electrónico:', emailError);
                    // Considera si quieres retornar un error o solo logearlo
                }

                return NextResponse.json({ message: 'Pedido actualizado y correo enviado' }, { status: 200 });
            } else {
                console.log('Pago no aprobado');
                return NextResponse.json({ message: 'Pago no aprobado' }, { status: 200 });
            }
        } else {
            console.log('Notificación no es de tipo pago');
            return NextResponse.json({ message: 'Notificación no es de tipo pago' }, { status: 200 });
        }
    } catch (error) {
        console.error('Error al procesar el webhook:', error);
        return NextResponse.json({ error: 'Error al procesar el webhook' }, { status: 500 });
    }
}

