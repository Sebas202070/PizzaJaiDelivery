// app/layout.js
'use client'; // Asegúrate de que es un componente de cliente
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartProvider } from './context/CartContext';
import { SessionProvider } from 'next-auth/react';




export default function RootLayout({ children }) {
  return (
    <html >
      <head>
        <title>Pizza Jai</title>
        <meta name="description" content="Tu pizzería favorita en línea." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="flex flex-col min-h-screen">
        <SessionProvider> {/* Envuelve tu aplicación con SessionProvider */}
          <CartProvider>
            <Navbar />
            <div className="flex-grow">{children}</div>
            <Footer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}