'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { BsCartFill } from 'react-icons/bs';
import { useContext } from 'react';
import { CartContext } from '@/app/context/CartContext';

const Navbar = () => {
  const { data: session, status } = useSession();
  const { cartItems } = useContext(CartContext);

  return (
    <nav className="bg-red-500 p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/images/pizza-jai-logo.jpg" alt="Pizza Jai Logo" width={50} height={50} className="mr-2" />
          <span className="text-white font-bold text-xl">Pizza Jai</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/productos" className="text-white">Productos</Link>
          <Link href="/carrito" className="text-white relative">
            <BsCartFill size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-4 bg-yellow-300 text-red-600 rounded-full px-2 text-xs">
                {cartItems.length}
              </span>
            )}
          </Link>
          {status === 'authenticated' ? (
            <div className="flex items-center space-x-2">
              <span className="text-white">Hola, {session?.user?.name || "Usuario"}</span>
              <button onClick={() => signOut()} className="text-white">
                (Cerrar Sesión)
              </button>
            </div>
          ) : (
            <Link href="/registro" className="text-white">Iniciar Sesión</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
