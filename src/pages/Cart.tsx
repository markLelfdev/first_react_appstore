// src/pages/Cart.tsx
import React from 'react';
import { useCart } from '../context/Cartcontext';
import styles from "../css/Cart.module.css";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';


const Cart: React.FC = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, deleteItem } = useCart();

  return (
    <div className={styles.container}>
      <h1>Cart</h1>
      <div>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
              <img src={item.image_url} className={styles.productImage} />
                <h3>{item.name}</h3>
                <p>{item.price} ฿</p>
                <p>Quantity: {item.qty}</p>
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <button onClick={() => increaseQuantity(item.id)}>+</button>
                <IconButton aria-label="delete" size="large" onClick={() => deleteItem(item.id)}>
                  <DeleteIcon  />
                </IconButton>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Cart;
