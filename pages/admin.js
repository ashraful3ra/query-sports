import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminPanel from '../components/AdminPanel';
import styles from '../styles/Home.module.css';

const Admin = () => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <AdminPanel />
    </div>
  );
};

export default Admin;
