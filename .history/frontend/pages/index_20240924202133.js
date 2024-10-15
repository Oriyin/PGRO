import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Welcome.module.css';

export default function Welcome() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome</title>
      </Head>
      <div className={styles.container}>
        <h2 className={styles.title}>66011050</h2>
        <h2 className={styles.title}>Laddaporn Thanomkaew</h2>
        <h2 className={styles.title}>1 person</h2>
        <div className={styles.buttonContainer}> {/* .buttonContainer */}
          <Link href="/logincustomer">
            <button className={styles.button}>Go to Customer Login</button>
          </Link>
          <Link href="/loginadmin">
            <button className={styles.button}>Go to Admin Page</button>
          </Link>
        </div>
      </div>
    </>
  );
}
