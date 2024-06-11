import React, { createContext, useContext, useState, ReactNode ,useEffect} from 'react';

interface CartItem {
  id: number;
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
  
//   สร้างมาเพื่อเก็บข้อมูลใช้ร่วมกัน
  export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() =>{
        // เก็บค่าในข้อมูล Local Storage  
        const cartItems = localStorage.getItem('cartItems');
        return cartItems? JSON.parse(cartItems) : [];
    });
  
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }, [cartItems]);

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
    };
  
    const increaseQuantity = (id: number) => {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    };
  
    const decreaseQuantity = (id: number) => {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
        ).filter(item => item.qty > 0) // Removes the item if quantity is 0
      );
    };
  
    return (
      <CartContext.Provider value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity }}>
        {children}
      </CartContext.Provider>
    );
  };