// src/components/Productcard.tsx
import React, { useState } from "react";
import styles from "../css/ProductCard.module.css";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useCart } from '../context/Cartcontext';


interface ProductcardProps {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image_url: string;
}

const Productcard: React.FC<ProductcardProps> = ({
  id,
  name,
  category,
  price,
  stock,
  description,
  image_url,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(stock, Math.max(1, Number(event.target.value)));
    setQuantity(value);
  };

  const handleAddToCart = () => {
    addToCart({ id,image_url, name, price, qty: quantity });
  };

  return (
    <div className={styles.productCard}>
      <img src={image_url} alt={name} className={styles.productImage} />
      <h3 className={styles.productName}>{name}</h3>
      <p className={styles.productPrice}>{price} ฿</p>
      <p className={styles.productStock}>stock :  {stock} </p>
      <p className={styles.productCategory}>Cate: {category}</p>
      <p className={styles.productDescription}>รายละเอียด: {description}</p>
      <div className={styles.cartSection}>
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          InputProps={{ inputProps: { min: 1, max: stock } }}
          sx={{ width: '60px', marginRight: '10px' }}
        />
        <IconButton onClick={handleAddToCart} color="primary">
          <ShoppingCartIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Productcard;
