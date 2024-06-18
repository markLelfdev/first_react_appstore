// src/pages/Cart.tsx
import React from "react";
import { useCart } from "../context/Cartcontext";
import styles from "../css/Cart.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RemoveIcon from "@mui/icons-material/Remove";

const Cart: React.FC = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, deleteItem } =
    useCart();

  const calprice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.qty, 0)
      .toFixed(2);
  };

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
                  <td className={styles.cart_table_Price}>
                    {" "}
                    {Number(item.price).toFixed(2)} ฿
                  </td>
                  <td>
                    <IconButton onClick={() => decreaseQuantity(item.id)}>
                      <RemoveIcon />
                    </IconButton>

                    {item.qty}

                    <IconButton onClick={() => increaseQuantity(item.id)}>
                      <AddBoxIcon />
                    </IconButton>
                  </td>
                  <td>
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
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>Total : </td>
                <td>{calprice()} ฿ </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Cart;
