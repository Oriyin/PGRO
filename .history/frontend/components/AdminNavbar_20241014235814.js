import React from 'react';
import Head from 'next/head';
import Link from 'next/link'; // Import Link from next/link
import styles from '../styles/navbar1.module.css'; // Ensure you are using .module.css for scoped styles

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
        <a href="#" className={styles.logo}>
          <i className='bx bxs-store'></i> Store Management
        </a>
        <div className={`bx bx-menu ${styles.menuIcon}`} id="menu-icon"></div>
        <ul className={styles.navbar}>
          <li>
            <Link href="/adminproduct" className={styles.navLink}>Manage Product</Link>
          </li>
          <li>
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          </li>
          <li>
            <Link href="/Report" className={styles.navLink}>Reports</Link>
          </li>
          <li>
            <Link href="/orders" className={styles.navLink}>Orders</Link>
          </li>
        </ul>
      </header>
    </>
  );
}
