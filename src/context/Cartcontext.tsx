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
  deleteItem: (id: number) => void;
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
  const [cartId, setCartId] = useState<string>('1'); // สมมติว่า cartId ถูกกำหนดไว้ กรณีล็อคอินเข้ามาจะเปลี่ยนค่าจาก 1 เป็นตาม User

  useEffect(() => {
    // ดึงข้อมูลตะกร้าสินค้าจาก API เมื่อคอมโพเนนต์ mount ขึ้นมา
    const fetchCartItems = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/cart/${cartId}`);
        setCartItems(res.data.map((item: any) => ({
          id: item.productid,
          image_url: item.image_url,
          name: item.name,
          price: item.price,
          qty: item.quantity
        })));
      } catch (error) {
        console.error('Failed to fetch cart items', error);
      }
    };

    fetchCartItems();
  }, [cartId]);

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
// เพิ่มจำนวนสินค้า 
  const updateQTYtoCart = async (productId: number,quantity: number) => {
    try{
      const config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `http://localhost:8080/api/cart/${cartId}/items/${productId}`,
        headers: { 
          'Content-Type': 'application/json'
        },
      data :{
        quantity : quantity
      }
    };
      axios.request(config)
    }catch (error) {
      console.error(error);
    }
  };

  const delProduct = async (productId: number) => {
    try {
      const config = {
        method: 'delete',
        url: `http://localhost:8080/api/cart/${cartId}/items/${productId}`,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      await axios(config);
    } catch (error) {
      console.error(error);
    }
  };

// เพิ่มข้อมูลจากหน้า Shop
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
      updateQTYtoCart(item.id, item.qty + 1);
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
      updateQTYtoCart(item.id, item.qty - 1);
    }
  };

  const deleteItem = (id: number) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== id)
    );
    delProduct(id);
  };

  useEffect(() => {
    // เทสว่า User Id เป็น 1 
    createOrUpdateCart('1');
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity, deleteItem }}>
      {children}
    </CartContext.Provider>
  );
};
