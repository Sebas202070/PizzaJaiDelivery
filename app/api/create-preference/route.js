import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
    try {
        const data = await request.json();
        const { cartItems, usuario } = data;

        console.log("Datos Recibidos:", data);
        console.log("Usuario Recibido:", usuario);
        console.log("Cart Items Recibidos:", cartItems);

        if (!cartItems || !Array.isArray(cartItems)) {
            return NextResponse.json({ error: 'cartItems is missing or not an array' }, { status: 400 });
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

        if (!usuario || typeof usuario !== 'object' || !usuario.id || !usuario.nombre || !usuario.email) {
            console.error("Usuario no válido:", usuario);
            return NextResponse.json({ error: 'Usuario no válido' }, { status: 400 });
        }

        const pedido = {
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
            },
            items: cartItems,
            total: cartItems.reduce((acc, item) => acc + item.price * item.cantidad, 0),
            pagado: false,
        };

        try {
            const result = await collection.insertOne(pedido);
            console.log("Pedido Insertado:", result);
            const orderId = result.insertedId;
            console.log("Order ID:", orderId);
            console.log("Order ID (string):", orderId.toString()); // Log adicional 
            console.log("Order ID:", orderId);

            const preferenceResult = await preference.create({
                body: {
                    items: items,
                    back_urls: {
                        success: "https://pizza-jai.vercel.app",
                        failure: `${process.env.NEXT_PUBLIC_URL}/failure`,
                        pending: `${process.env.NEXT_PUBLIC_URL}/pending`,
                    },
                    notification_url: "https://pizza-jai.vercel.app/api/webhook-mercadopago",
                    auto_return: 'approved',
                    metadata: {
                        order_id: orderId.toString(),
                    },
                },
            });

            console.log("Preferencia Creada:", preferenceResult);
            return NextResponse.json({ preferenceId: preferenceResult.id });
        } catch (dbError) {
            console.error("Error al insertar en la base de datos:", dbError);
            return NextResponse.json({ error: 'Error al insertar en la base de datos' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error al crear la preferencia:', error);
        return NextResponse.json({ error: 'Error al crear la preferencia' }, { status: 500 });
    }
}

// /api/webhook-mercadopago/route.js
