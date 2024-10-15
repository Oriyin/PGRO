import React from 'react';
import Head from 'next/head';
import Link from 'next/link'; // Import Link from next/link
import styles from '../styles/navbar.module.css'; // Import CSS

export default function Navbar() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Store Management</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="/store-logo.png" alt="Store Management" />
          <span className={styles.storeText}>Store Management</span>
        </div>
        <a href="#" className={styles.logo}>
          <i className='bx bxs-store'></i>
        </a>
        <div className="bx bx-menu" id="menu-icon"></div>
        <ul className={styles.navbar}>
          <li>
            <Link href="/adminproducts" className={styles.navLink}>Manage Product</Link>
          </li>
          <li>
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          </li>
          <li>
            <Link href="/reports" className={styles.navLink}>Reports</Link>
          </li>
          <li>
            <Link href="/orders" className={styles.navLink}>Orders</Link>
          </li>
        </ul>
        <div className={styles.profile}>
          <img src="/profile-icon.png" alt="Profile" />
          <i className='bx bx-caret-down'></i>
        </div>
      </header>
    </>
  );
}
