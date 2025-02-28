'use client';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import Image from 'next/image';

const Carrito = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {cartItems.map((item, index) => (
              <li key={index} className="flex items-center border p-4 rounded-lg">
                <Image src={item.image} alt={item.name} width={100} height={80} className="mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="font-bold">${item.price}</p>
                </div>
                <button
                  className="bg-red-500 text-white p-2 rounded ml-auto"
                  onClick={() => removeFromCart(index)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Total: ${calculateTotal()}</h2>
            <button className="bg-green-500 text-white p-2 rounded mt-4">Realizar Pago</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;