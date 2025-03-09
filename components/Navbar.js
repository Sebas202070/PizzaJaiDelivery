'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { BsCartFill } from 'react-icons/bs';
import { useContext } from 'react';
import { CartContext } from '@/app/context/CartContext';
import UserMenu from '@/components/UserMenu';

const Navbar = () => {
    const { data: session, status } = useSession();
    const { cartItems } = useContext(CartContext);

    return (
        <nav className="bg-red-500 p-6 sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center">
                    <Image src="/images/pizza-jai-logo.jpg" alt="Pizza Jai Logo" width={70} height={70} className="mr-4" />
                    <div className="flex flex-col"> {/* Contenedor para Pizza Jai y Delivery */}
                        <span className="text-white font-bold text-3xl">Pizza Jai</span>
                        <span className="text-white text-sm">Delivery</span>
                    </div>
                </Link>
                <div className="flex items-center space-x-8">
                    <Link href="/productos" className="text-white text-lg hover:text-red-200 transition-colors duration-200">Productos</Link>
                    <Link href="/carrito" className="text-white relative hover:text-red-200 transition-colors duration-200">
                        <BsCartFill size={30} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-4 right-0 bg-yellow-300 text-red-600 rounded-full px-2 text-xs">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                    {status === 'authenticated' ? (
                        <div className="flex items-center">
                            <UserMenu />
                        </div>
                    ) : (
                        <Link href="/registro" className="text-white text-lg hover:text-red-200 transition-colors duration-200">Iniciar Sesión</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;