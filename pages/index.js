import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(new Date().toLocaleString());
  }, []);

  return (
    <>
      <Head>
        <title>Aap-FT</title>
      </Head>
      <div style={styles.container}>
      <h1 style={styles.title}>Hello World! 👋</h1>
      <p style={styles.description}>
        This is a simple Next.js app running on Vercel
      </p>
      {time && <p style={styles.time}>Current time: {time}</p>}
      </div>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '3rem',
    color: '#333',
    margin: 0,
  },
  description: {
    fontSize: '1.2rem',
    color: '#666',
    marginTop: '1rem',
  },
  time: {
    fontSize: '0.9rem',
    color: '#999',
    marginTop: '2rem',
  },
};
