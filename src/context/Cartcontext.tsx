// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface CartItem {
  id: number;
  image_url : string;
  name: string;
  price: number;
  qty: number;
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string>('1'); // สมมติว่า cartId ถูกกำหนดไว้

  useEffect(() => {
    // ดึงข้อมูลตะกร้าสินค้าจาก localStorage เมื่อคอมโพเนนต์ mount ขึ้นมา
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  useEffect(() => {
    // บันทึกข้อมูลตะกร้าสินค้าใน localStorage เมื่อ cartItems เปลี่ยนแปลง
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const createOrUpdateCart = async (userid: string) => {
    try {
      const options = {
        method: 'POST',
        url: 'http://localhost:8080/api/cart',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          userid: userid
        }
      };

      const res = await axios(options);
      setCartId(res.data.cartid);
    } catch (error) {
      console.error(error);
    }
  };

  const addItemToCart = async (productId: string, quantity: number) => {
    try {
      const options = {
        method: 'POST',
        url: `http://localhost:8080/api/cart/${cartId}/items`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          productid: productId,
          quantity: quantity
        }
      };

      await axios(options);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
        );
      }
      return [...prevItems, item];
    });
    addItemToCart(item.id.toString(), item.qty);
  };

  const increaseQuantity = (id: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
    const item = cartItems.find(item => item.id === id);
    if (item) {
      addItemToCart(item.id.toString(), item.qty + 1);
    }
  };

  const decreaseQuantity = (id: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      ).filter(item => item.qty > 0) // Removes the item if quantity is 0
    );
    const item = cartItems.find(item => item.id === id);
    if (item && item.qty > 1) {
      addItemToCart(item.id.toString(), item.qty - 1);
    }
  };

  useEffect(() => {
    createOrUpdateCart('1');
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
