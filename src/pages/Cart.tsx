// src/pages/Cart.tsx
import React from 'react';
import { useCart } from '../context/Cartcontext';

const Cart: React.FC = () => {
  const { cartItems, increaseQuantity, decreaseQuantity } = useCart();

  return (
    <div>
      <h1>Cart</h1>
      <div>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                <h3>{item.name}</h3>
                <p>{item.price} ฿</p>
                <p>Quantity: {item.qty}</p>
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <button onClick={() => increaseQuantity(item.id)}>+</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Cart;
