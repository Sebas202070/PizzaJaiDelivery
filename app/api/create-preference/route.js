import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db.mjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

export async function POST(request) {
    try {
        const data = await request.json();
        const { cartItems, usuario, orderId } = data;

        console.log("Datos Recibidos para crear preferencia:", data);
        console.log("Order ID Recibido:", orderId);

        if (!cartItems || !Array.isArray(cartItems)) {
            return NextResponse.json({ error: 'cartItems is missing or not an array' }, { status: 400 });
        }

        if (!orderId) {
            return NextResponse.json({ error: 'orderId is missing' }, { status: 400 });
        }

        const client = new MercadoPagoConfig({
            accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
        });

        const preference = new Preference(client);

        const items = cartItems.map((item) => ({
            title: item.name,
            unit_price: item.price,
            quantity: item.cantidad,
        }));

        console.log('Items a enviar a Mercado Pago:', items);

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbClient = await clientPromise;
        if (!dbClient) {
            console.error("Error al conectar a la base de datos");
            return NextResponse.json({ error: 'Error al conectar a la base de datos' }, { status: 500 });
        }

        const db = dbClient.db('pizzas_jai');
        const collection = db.collection('pedidos');

        try {
            // Verificar si el pedido existe
            const pedido = await collection.findOne({ _id: new ObjectId(orderId) });
            if (!pedido) {
                return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
            }

            const preferenceResult = await preference.create({
                body: {
                    items: items,
                    back_urls: {
                        success: "https://pizza-jai.vercel.app",
                        failure: `${process.env.NEXT_PUBLIC_URL}/failure`,
                        pending: `${process.env.NEXT_PUBLIC_URL}/pending`,
                    },
                    notification_url: "https://104c-161-0-64-94.ngrok-free.app/api/webhook-mercadopago",
                    auto_return: 'approved',
                    external_reference: orderId.toString(), // Usar orderId como referencia externa
                    metadata: {
                        order_id: orderId.toString(),
                    },
                },
            });

            console.log("Preferencia Creada:", preferenceResult);
            return NextResponse.json({ preferenceId: preferenceResult.id });
        } catch (dbError) {
            console.error("Error al interactuar con la base de datos:", dbError);
            return NextResponse.json({ error: 'Error al interactuar con la base de datos' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error al crear la preferencia:', error);
        return NextResponse.json({ error: 'Error al crear la preferencia' }, { status: 500 });
    }
}