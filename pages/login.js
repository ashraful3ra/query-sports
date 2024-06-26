import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Replace with your default username and password
    const defaultUsername = 'Ashraful';
    const defaultPassword = 'dEmo@2014';

    if (username === defaultUsername && password === defaultPassword) {
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Login</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Login</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
