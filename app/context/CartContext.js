'use client';
import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (pizza) => {
    const existingItemIndex = cartItems.findIndex((item) => item.name === pizza.name);

    if (existingItemIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].cantidad += 1;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...pizza, cantidad: 1 }]);
    }
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].cantidad += 1;
    setCartItems(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].cantidad > 1) {
      updatedCart[index].cantidad -= 1;
      setCartItems(updatedCart);
    } else {
      removeFromCart(index);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const cantidad = typeof item.cantidad === 'number' ? item.cantidad : 1;
      return total + price * cantidad;
    }, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const total = calculateTotal();

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        total,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};