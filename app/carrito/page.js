'use client';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import Image from 'next/image';
import PaymentButton from '@/components/PaymentButton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Carrito = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, total } = useContext(CartContext);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Carrito de Compras</h1>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Tu carrito está vacío.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center bg-white rounded-lg shadow-md p-4">
                  <Image src={item.image} alt={item.name} width={100} height={80} className="mr-4 rounded" />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <div className="flex items-center mt-2">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-l"
                        onClick={() => decreaseQuantity(index)}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.cantidad}</span>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-r"
                        onClick={() => increaseQuantity(index)}
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold text-lg">${item.price * item.cantidad}</p>
                  </div>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    onClick={() => removeFromCart(index)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Resumen del Pedido</h2>
              <p className="text-lg font-semibold">Total: ${total}</p>
              <div className="mt-6">
                {session ? (
                  <PaymentButton cartItems={cartItems} />
                ) : (
                  <p className="text-center text-gray-600">
                    Debes iniciar sesión para comprar. <Link href="/login" className="text-blue-500">Iniciar sesión</Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;