// app/api/pedidos/route.js
import clientPromise from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';


export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('pizzas_jai');
        const collection = db.collection('pedidos');

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        let pedidos;

        if (userId) {
            console.log('userId:', userId);
            console.log('userId from query:', userId);

            // Verificar autorización
            if (session.user.rol !== 'admin' && userId !== session.user.id) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            try {
                pedidos = await collection.find({ "usuario.id": userId }).toArray();
                console.log('Pedidos encontrados:', pedidos);
            } catch (error) {
                console.error('Error filtering by userId:', error);
                return NextResponse.json({ error: 'Error filtering by userId' }, { status: 500 });
            }
        } else {
            // Verificar autorización para obtener todos los pedidos
            if (session.user.rol !== 'admin') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            pedidos = await collection.find({}).toArray();
        }

        console.log('API Response (pedidos):', pedidos);
        return NextResponse.json(pedidos);
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const pedido = await req.json();
        console.log('Pedido recibido en /api/pedidos (POST):', pedido);

        // Verificar autorización
        if (session.user.rol !== 'admin' && pedido.usuario.id !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const client = await clientPromise;
        const db = client.db('pizzas_jai');
        const collection = db.collection('pedidos');

        const result = await collection.insertOne({
            usuario: {
                id: pedido.usuario.id,
                nombre: pedido.usuario.nombre,
                email: pedido.usuario.email,
            },
            items: pedido.items,
            total: pedido.total,
            pagado: pedido.pagado,
        });

        console.log('Pedido insertado con ID:', result.insertedId);

        return NextResponse.json({ message: 'Pedido guardado con éxito' }, { status: 200 });
    } catch (error) {
        console.error('Error al guardar el pedido (POST):', error);
        return NextResponse.json({ error: 'Error al guardar el pedido' }, { status: 500 });
    }
}