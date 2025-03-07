// app/api/test-db/route.js
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('pizzas_jai'); // Reemplaza 'pizzas_jai' con el nombre de tu base de datos
    await db.command({ ping: 1 }); // Intenta hacer ping a la base de datos
    client.close(); // Cierra la conexión
    return NextResponse.json({ message: 'Conexión a la base de datos exitosa' });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return NextResponse.json(
      { message: 'Error al conectar a la base de datos', error: error.message },
      { status: 500 }
    );
  }
}