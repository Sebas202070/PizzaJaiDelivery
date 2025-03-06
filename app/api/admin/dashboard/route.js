// app/api/admin/dashboard/route.js
import clientPromise from '@/lib/db'; // Asegúrate de tener tu conexión a MongoDB
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('pizzas_jai'); // Reemplaza 'test' con el nombre de tu base de datos

    const usuarios = await db.collection('usuarios').find({}).toArray();
    const pedidos = await db.collection('pedidos').find({}).toArray();

    return NextResponse.json({ usuarios, pedidos });
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}