import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

import clientPromise from './lib/db.mjs';
import { ObjectId } from 'mongodb';
import emailQueue from './utils/emailQueue.mjs';

emailQueue.process(async (job) => {
    console.log('Trabajo recibido en emailWorker:', JSON.stringify(job.data, null, 2));
    const { orderId } = job.data;

    try {
        const client = await clientPromise;
        if (!client) {
            console.error('Error al conectar a MongoDB');
            return;
        }
        console.log('Conexión a MongoDB establecida');

        const db = client.db('pizzas_jai');
        const collection = db.collection('pedidos');
        const pedido = await collection.findOne({ _id: new ObjectId(orderId) });

        console.log('Consulta a MongoDB:', { _id: new ObjectId(orderId) });
        console.log('Pedido recuperado:', pedido);

        if (!pedido) {
            console.error(`Pedido no encontrado para el trabajo ${job.id}`);
            return;
        }

        if (!pedido.usuario || !pedido.usuario.email) {
            console.error(`Datos de usuario incompletos para el pedido ${orderId}`);
            return;
        }

        if (!pedido.items || pedido.items.length === 0) {
            console.error(`Datos de items incompletos para el pedido ${orderId}`);
            return;
        }

        if (!pedido.total) {
            console.error(`Datos de total incompletos para el pedido ${orderId}`);
            return;
        }

        console.log('Intentando enviar correo electrónico...');
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
        console.log('Configuración de Nodemailer:', {
            user: process.env.EMAIL_USER,
            // No loguees la contraseña por seguridad
        });

        // Agregar log de depuración para pedido.address
        console.log('Pedido address antes de mailOptions:', pedido.address);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: pedido.usuario.email,
            subject: 'Tu pago ha sido aprobado',
            text: `¡Hola ${pedido.usuario.nombre}!
            
            Tu pago ha sido aprobado. Aquí está el detalle de tu pedido:
            
            Dirección de envío: 
            ${pedido.address && typeof pedido.address === 'object' ? `
            Calle: ${pedido.address.street ? pedido.address.street : 'No proporcionada'} ${pedido.address.number ? pedido.address.number : ''}
            Piso: ${pedido.address.floor ? pedido.address.floor : 'No proporcionado'}, Departamento: ${pedido.address.apartment ? pedido.address.apartment : 'No proporcionado'}
            Código Postal: ${pedido.address.postalCode ? pedido.address.postalCode : 'No proporcionado'}, Ciudad: ${pedido.address.city ? pedido.address.city : 'No proporcionada'}, Provincia: ${pedido.address.province ? pedido.address.province : 'No proporcionada'}
            ` : 'No proporcionada'}
            
            Pedido:
            ${pedido.items.map(item => `- ${item.cantidad} x ${item.nombre} - $${item.precio}`).join('\n')}
            
            Total: $${pedido.total}
            
            ¡Gracias por tu compra!`,
        };
        console.log('Opciones de correo electrónico:', mailOptions);

        const info = await transporter.sendMail(mailOptions);
        console.log(`Correo electrónico enviado para el trabajo ${job.id}:`, info);

    } catch (error) {
        console.error(`Error al procesar el trabajo ${job.id}:`, error);
        if (error.response) {
            console.error('Respuesta de Nodemailer:', error.response);
        }
    }
});

console.log('Procesador de cola de correos iniciado');