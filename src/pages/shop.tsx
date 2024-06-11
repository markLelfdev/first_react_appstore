// src/pages/Shop.tsx
import React, { useState, useEffect } from 'react';
import Productcard from "../components/ProductCard";
import styles from "../components/css/Shop.module.css";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  image_url: string;
}

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={styles.shopContainer}>
      <h1>Shop</h1>
      <div className={styles.productsContainer}>
        {products.map(product => (
          <Productcard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
