'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { BsCartFill } from 'react-icons/bs';
import { useContext, useEffect, useState } from 'react'; // Importar useEffect y useState
import { CartContext } from '@/app/context/CartContext';
import UserMenu from '@/components/UserMenu';

const Navbar = () => {
    const { data: session, status } = useSession();
    const { cartItems } = useContext(CartContext);
    const [cartIconSize, setCartIconSize] = useState(24); // Estado para el tamaño del icono

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCartIconSize(window.innerWidth >= 768 ? 30 : 24);
        }
    }, []); // Ejecutar solo una vez al montar el componente

    return (
        <nav className="bg-red-500 p-4 md:p-6 sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                <Link href="/" className="flex items-center">
                    <Image src="/images/pizza-jai-logo.jpg" alt="Pizza Jai Logo" width={60} height={60} className="mr-2" />
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-xl md:text-3xl">Pizza Jai</span>
                        <span className="text-white text-xs">Delivery</span>
                    </div>
                </Link>
                <div className="flex items-center space-x-2 md:space-x-8">
                    <Link href="/productos" className="text-white text-sm md:text-lg hover:text-red-200 transition-colors duration-200">Productos</Link>
                    <Link href="/carrito" className="text-white relative hover:text-red-200 transition-colors duration-200">
                        <BsCartFill size={cartIconSize} /> {/* Usar el estado */}
                        {cartItems.length > 0 && (
                            <span className="absolute -top-3 right-0 bg-yellow-300 text-red-600 rounded-full px-1 text-xs">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                    {status === 'authenticated' ? (
                        <div className="flex items-center">
                            <UserMenu />
                        </div>
                    ) : (
                        <Link href="/registro" className="text-white text-sm md:text-lg hover:text-red-200 transition-colors duration-200">Iniciar Sesión</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;