// test-email.js
import nodemailer from 'nodemailer';

async function sendTestEmail() {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Reemplaza con tu servidor SMTP
            port: 587, // Reemplaza con el puerto SMTP
            secure: false, // Usamos STARTTLS, así que secure es false
            auth: {
                type: 'login',
                user: "taisushiok@gmail.com", // Reemplaza con tu correo electrónico
                pass: "lykneadhgfevnkjz", // Reemplaza con tu contraseña
            },
        });

        const mailOptions = {
            from: "taisushiok@gmail.com", // Reemplaza con tu correo electrónico
            to: 'sebastianrnajleok@gmail.com', // Reemplaza con el correo de destino
            subject: 'Correo de prueba de Nodemailer',
            text: 'Este es un correo de prueba enviado desde Nodemailer.',
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Correo de prueba enviado:', info);
    } catch (error) {
        console.error('Error al enviar el correo de prueba:', error);
    }
}

sendTestEmail();