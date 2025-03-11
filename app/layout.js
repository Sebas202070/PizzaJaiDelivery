'use client';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartProvider } from './context/CartContext';
import { SessionProvider } from 'next-auth/react';
import { EnvioProvider } from './context/EnvioContext'; // Importa EnvioProvider

export default function RootLayout({ children }) {
    return (
        <html>
            <head>
                <title>Pizza Jai</title>
                <meta name="description" content="Tu pizzería favorita en línea." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body className="flex flex-col min-h-screen">
                <SessionProvider>
                    <CartProvider>
                        <EnvioProvider> {/* Envuelve EnvioProvider con CartProvider */}
                            <Navbar />
                            <div className="flex-grow">{children}</div>
                            <Footer />
                        </EnvioProvider>
                    </CartProvider>
                </SessionProvider>
            </body>
        </html>
    );
}