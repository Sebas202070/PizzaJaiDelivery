// app/api/pedidos/route.js
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const client = await clientPromise;
  const db = client.db('pizzas_jai');
  const collection = db.collection('pedidos');

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  try {
    let pedidos;

    if (userId) {
      console.log('userId:', userId);
      console.log('userId from query:', userId);
      try {
        const objectIdUserId = new ObjectId(userId);
        console.log('objectIdUserId:', objectIdUserId);
        pedidos = await collection.find({ "usuario.id": objectIdUserId }).toArray();
        console.log('Pedidos encontrados:', pedidos); // Log agregado
      } catch (objectIdError) {
        console.error('Error converting userId to ObjectId:', objectIdError);
        return NextResponse.json({ error: 'Error converting userId to ObjectId' }, { status: 500 });
      }
    } else {
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
    const pedido = await req.json();
    console.log('Pedido recibido en /api/pedidos (POST):', pedido);

    const client = await clientPromise;
    const db = client.db('pizzas_jai');
    const collection = db.collection('pedidos');

    const result = await collection.insertOne({
      usuario: {
        id: new ObjectId(pedido.usuario.id),
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