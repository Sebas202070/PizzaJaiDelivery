import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

import clientPromise from './lib/db.mjs';
import { ObjectId } from 'mongodb';
import emailQueue from './utils/emailQueue.mjs';

emailQueue.process(async (job) => {
    console.log('Trabajo recibido en emailWorker:', JSON.stringify(job.data, null, 2)); // Log adicional
    const { orderId } = job.data;

    const client = await clientPromise;
    if (!client) {
        console.error('Error al conectar a MongoDB'); // Log adicional
        return;
    }
    console.log('Conexión a MongoDB establecida'); // Log adicional

    const db = client.db('pizzas_jai');
    const collection = db.collection('pedidos');
    const pedido = await collection.findOne({ _id: new ObjectId(orderId) });

    console.log('Consulta a MongoDB:', { _id: new ObjectId(orderId) }); // Log adicional
    console.log('Pedido recuperado:', pedido); // Log adicional

    if (!pedido) {
        console.error(`Pedido no encontrado para el trabajo ${job.id}`);
        return;
    }

    try {
        console.log('Intentando enviar correo electrónico...'); // Log adicional
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                type: 'login',
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log('Configuración de Nodemailer:', { // Log adicional
            user: process.env.EMAIL_USER,
            // No loguees la contraseña por seguridad
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'sebastianrnajleok@gmail.com', // Cambiar a pedido.usuario.email cuando este disponible.
            subject: 'Tu pago ha sido aprobado',
            text: 'hola', // Cambiar por el texto del mail que necesites.
        };
        console.log('Opciones de correo electrónico:', mailOptions); // Log adicional

        const info = await transporter.sendMail(mailOptions);
        console.log(`Correo electrónico enviado para el trabajo ${job.id}:`, info);
    } catch (error) {
        console.error(`Error al enviar el correo electrónico para el trabajo ${job.id}:`, error);
        if (error.response) { // Log adicional
            console.error('Respuesta de Nodemailer:', error.response);
        }
    }
});

console.log('Procesador de cola de correos iniciado');