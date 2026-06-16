import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const itemsGuardados = localStorage.getItem('carrito');
      return itemsGuardados ? JSON.parse(itemsGuardados) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.id === product.id);

      if (itemIndex !== -1) {
        const newItems = [...prevItems];
        newItems[itemIndex].cantidad += quantity;
        if (product.precio_actual) {
            newItems[itemIndex].precio_actual = product.precio_actual;
            newItems[itemIndex].tiene_descuento = product.tiene_descuento;
        }
        return newItems;
      } else {
        return [...prevItems, { ...product, cantidad: quantity }];
      }
    });
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => {
      const precioFinal = item.precio_actual ? Number(item.precio_actual) : Number(item.precio_prod);
      return acc + (precioFinal * item.cantidad);
  }, 0);

  const totalSinDescuento = cartItems.reduce((acc, item) => {
      return acc + (Number(item.precio_prod) * item.cantidad);
  }, 0);

  const totalAhorro = totalSinDescuento - cartTotal;

  return (
    <CartContext.Provider value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        clearCart,
        cartTotal,     
        totalAhorro,    
        totalSinDescuento 
    }}>
      {children}
    </CartContext.Provider>
  );
};