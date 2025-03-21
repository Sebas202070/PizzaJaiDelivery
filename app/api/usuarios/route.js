// app/api/usuarios/route.js
import clientPromise from '@/lib/db.mjs';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('pizzas_jai');
  const collection = db.collection('usuarios');

  try {
    const usuarios = await collection.find({}).toArray();
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}