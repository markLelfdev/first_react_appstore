import React from "react";
import styles from "../css/Header.module.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Person4Icon from "@mui/icons-material/Person4";
import { Link } from "react-router-dom";
import logo from "../assets/LogoBan.jpg";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
      <Link to="/">
      <img src={logo} alt="logo" 
      className={styles.logo}/>
      </Link></div>
      <div className={styles.nav}>
        <div className={styles.cart}>
          <Link to="/cart">
            <ShoppingCartIcon />
          </Link>
          <span>Cart</span>
        </div>
        <div className={styles.profile}>
          <Person4Icon style={{ marginRight: "5px" }} />
          <span>Profile</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
