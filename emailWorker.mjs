import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db.mjs';
import { ObjectId } from 'mongodb';
import emailQueue from '@/utils/emailQueue.mjs';

export async function POST(req) {
    try {
        const parsedData = await req.json();
        console.log('Webhook data:', JSON.stringify(parsedData, null, 2));

        if (parsedData.type === 'payment') {
            const paymentId = parsedData.data.id;
            console.log('Payment ID:', paymentId);

            const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
            const paymentDetailsResponse = await fetch(
                `https://api.mercadopago.com/v1/payments/${paymentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!paymentDetailsResponse.ok) {
                console.error(
                    'Error al obtener detalles del pago de Mercado Pago:',
                    paymentDetailsResponse.status,
                    paymentDetailsResponse.statusText
                );
                return NextResponse.json(
                    { error: 'Error al obtener detalles del pago' },
                    { status: 500 }
                );
            }

            const paymentDetails = await paymentDetailsResponse.json();
            console.log('Payment details:', JSON.stringify(paymentDetails, null, 2));

            if (paymentDetails.status === 'approved') {
                const orderId = paymentDetails.metadata.order_id;
                console.log('Order ID from metadata:', orderId);
                console.log(
                    'Payment details.metadata:',
                    JSON.stringify(paymentDetails.metadata)
                );

                if (!orderId) {
                    console.error('Order ID no encontrado en metadata');
                    return NextResponse.json(
                        { error: 'Order ID no encontrado' },
                        { status: 400 }
                    );
                }

                const client = await clientPromise;
                const db = client.db('pizzas_jai');
                const collection = db.collection('pedidos');

                console.log('Conexión a MongoDB establecida');

                const updateResult = await collection.updateOne(
                    { _id: new ObjectId(orderId) },
                    { $set: { pagado: true } }
                );

                console.log('Update Result:', JSON.stringify(updateResult, null, 2));

                if (updateResult.modifiedCount === 0) {
                    console.error('Pedido no encontrado o ya actualizado');
                    return NextResponse.json(
                        { error: 'Pedido no encontrado o ya actualizado' },
                        { status: 404 }
                    );
                }

                console.log('Pedido actualizado a pagado');

                try {
                    emailQueue.add({ orderId: orderId });
                    console.log('Trabajo agregado a la cola con orderId:', orderId);
                } catch (queueError) {
                    console.error('Error al agregar trabajo a la cola:', queueError);
                }

                return NextResponse.json(
                    { message: 'Pedido actualizado y trabajo encolado' },
                    { status: 200 }
                );
            } else {
                console.log('Pago no aprobado');
                return NextResponse.json({ message: 'Pago no aprobado' }, { status: 200 });
            }
        } else {
            console.log('Notificación no es de tipo pago');
            return NextResponse.json(
                { message: 'Notificación no es de tipo pago' },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('Error al procesar el webhook:', error);
        console.error('Pila de llamadas del error:', error.stack);
        return NextResponse.json(
            { error: 'Error al procesar el webhook' },
            { status: 500 }
        );
    }
}