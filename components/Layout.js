import React from 'react';
import Link from 'next/link';
import styles from '../styles/Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/">
          <img src="/logo.png" alt="Logo" className={styles.logo} />
        </Link>
      </header>
      <main className={styles.main}>
        <div className={styles.container}>
          {children}
        </div>
      </main>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Query Sports. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
