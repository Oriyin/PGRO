import React from 'react';
import Head from 'next/head';
import styles from '../styles/navbar.module.css'; // Import CSS

export default function Navbar() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Store</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/shopping-bag.png" alt="Grocery" />
          <span className="grocerytext">Grocery</span>
        </div>
        <a href="#" className={styles.logo}>
          <i className='bx bxs-basket'></i>
        </a>
        <div className="bx bx-menu" id="menu-icon"></div>
        <ul className={styles.navbar}>
          <li><a href="#Home" className="home-active">Home</a></li>
          <li><a href="#All Products">All Products</a></li>
          <li><a href="#AboutUs">About Us</a></li>
          <li><a href="#Cart">Cart</a></li>
        </ul>
        <div className={styles.profile}>
          <img src="/Profile.png" alt="Profile" />
          <i className='bx bx-caret-down'></i>
        </div>
      </header>
    </>
  );
}