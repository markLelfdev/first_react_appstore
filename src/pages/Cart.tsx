// src/pages/Cart.tsx
import React from "react";
import { useCart } from "../context/Cartcontext";
import styles from "../css/Cart.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const Cart: React.FC = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, deleteItem } =
    useCart();

  return (
    <div className={styles.container}>
      <div className={styles.h1}>Cart </div>
      <div>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <table className={styles.cart_table}>
            <thead>
              <tr>
                <th>Picture</th>
                <th>Name</th>
                <th>Price</th>
                <th>QTY</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className={styles.cart_table_td_image}>
                    {
                      <img
                        src={item.image_url}
                        className={styles.productImage}
                      />
                    }
                  </td>
                  <td>{item.name}</td>
                  <td>{item.price} ฿</td>
                  <td>{item.qty}</td>
                  <td>
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                    <IconButton
                      aria-label="delete"
                      size="large"
                      onClick={() => deleteItem(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Cart;
