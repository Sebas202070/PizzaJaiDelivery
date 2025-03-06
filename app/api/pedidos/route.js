// app/api/pedidos/route.js
import clientPromise from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const pedido = await req.json();
    const client = await clientPromise;
    const db = client.db('pizzas_jai'); 

    await db.collection('pedidos').insertOne(pedido);

    return NextResponse.json({ message: 'Pedido guardado con éxito' });
  } catch (error) {
    console.error('Error al guardar el pedido:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}