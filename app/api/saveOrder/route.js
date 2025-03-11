// app/api/saveOrder/route.js
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

client = new MongoClient(uri, options);
clientPromise = client.connect();

export async function POST(req) {
    const { userId, cartItems, deliveryOption, address, total } = await req.json();

    try {
        const mongoClient = await clientPromise;
        const db = mongoClient.db(process.env.MONGODB_DB);
        const collection = db.collection('orders');

        const order = await collection.insertOne({
            userId,
            cartItems,
            deliveryOption,
            address,
            total,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: 'Orden guardada', order }, { status: 200 });
    } catch (error) {
        console.error('Error al guardar la orden:', error);
        return NextResponse.json({ error: 'Error al guardar la orden' }, { status: 500 });
    }
}