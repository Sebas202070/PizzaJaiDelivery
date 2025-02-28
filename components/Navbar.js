'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { BsCartFill } from 'react-icons/bs'; // Importa el icono del carrito

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-red-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/images/pizza-jai-logo.jpg" alt="Pizza Jai Logo" width={50} height={50} className="mr-2" />
          <span className="text-white font-bold text-xl">Pizza Jai</span>
        </Link>
        <div className="flex items-center space-x-4">
          
        
          
          {session ? (
            <button onClick={() => signOut()} className="text-white">Cerrar Sesión</button>
          ) : (
            <Link href="/registro" className="text-white">Iniciar Sesión</Link>
          )}

<Link href="/productos" className="text-white">Productos</Link>
          <Link href="/carrito" className="text-white">
            <BsCartFill size={24} /> {/* Icono del carrito */}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;