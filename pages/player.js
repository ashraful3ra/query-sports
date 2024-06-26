import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import styles from '../styles/Player.module.css';

const Player = () => {
  const router = useRouter();
  const { streamUrl } = router.query;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <a href="/">Home</a>
          <a href="/privacy">Privacy And Policy</a>
          <a href="/dmca">DMCA</a>
        </nav>
      </header>
      <main className={styles.main}>
        <div className={styles.playerContainer}>
          <VideoPlayer streamUrl={streamUrl} />
          <a href="#" className={styles.telegramLink}>Join us on Telegram</a>
        </div>
        <section className={styles.infoSection}>
          <h2>T20 World Cup 2024</h2>
          <p>Live Cricket</p>
          <div className={styles.channelTags}>
            {/* Replace these with actual channel tags */}
            <span>Amazon Prime 1</span>
            <span>Amazon Prime Plus</span>
            <span>Amazon Prime 2</span>
            <span>Willow by CricBuzz 1</span>
            <span>Willow by CricBuzz 2</span>
            <span>Sky Sports Cricket 1</span>
            <span>Sky Sports Cricket 2</span>
            <span>Sky Sports Cricket 3</span>
            <span>Sky Sports Cricket 4</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Player;
