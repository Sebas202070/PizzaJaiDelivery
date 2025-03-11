'use client';
import dynamic from 'next/dynamic';

const DynamicCarrito = dynamic(() => import('./Carrito'), {
    ssr: false,
});

export default function CarritoPage() {
    return <DynamicCarrito />;
}