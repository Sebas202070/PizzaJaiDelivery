'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect, useContext } from 'react';
import { UserCircleIcon } from '@heroicons/react/20/solid';
import { CartContext } from '@/app/context/CartContext';

const UserMenu = () => {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const { clearCart } = useContext(CartContext);

    useEffect(() => {
      const handleClickOutside = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
              setIsOpen(false);
          }
      };

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [menuRef]);

  if (!session) {
      return null;
  }

  const toggleMenu = () => {
      setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
      clearCart(); // Vaciar el carrito
      signOut();
  };
    
    
    return (
      <div className="relative flex items-center" ref={menuRef}> {/* Modificado: flex items-center */}
      <div className="flex items-center"> {/* Contenedor para icono y texto */}
          <div className="mt-0 mr-2"> {/* Agregado mr-2 para margen derecho */}
              <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 p-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  id="menu-button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={toggleMenu}
              >
                  <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
              </button>
          </div>
          <div className="mt-1 text-lg text-white">
              Hola, {session.user.name}
          </div>
      </div>

      {isOpen && (
          <div
              className="absolute right-0 top-full mt-1 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex="-1"
          >
              <div className="py-2 flex flex-col items-center">
                  {session.user.rol === 'admin' && (
                      <Link
                          href="/admin/dashboard"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 text-center"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-0"
                      >
                          Dashboard
                      </Link>
                  )}
                  {session.user.rol === 'usuario' && (
                      <Link
                          href="/admin/dashboard"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 text-center"
                          role="menuitem"
                          tabIndex="-1"
                          id="menu-item-1"
                      >
                          Mis Pedidos
                      </Link>
                  )}
                  <button
                      onClick={() => handleSignOut()}
                      className="block w-full px-4 py-3 text-center text-sm text-red-600 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex="-1"
                      id="menu-item-2"
                  >
                      Cerrar Sesión
                  </button>
              </div>
          </div>
      )}
  </div>
    );
};

export default UserMenu;