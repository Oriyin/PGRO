import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar'; // Import Navbar component
import styles from '../styles/storebg.module.css'; // Import your background CSS

export default function Store() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Store</title>
      </Head>

      <Navbar /> {/* Use Navbar component */}

      {/* Apply the container class from the CSS module */}
      <div className={styles.container}></div>
    </>
  );
}

