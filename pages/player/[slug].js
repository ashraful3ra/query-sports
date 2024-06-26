import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import VideoPlayer from '../../components/VideoPlayer';
import styles from '../../styles/Player.module.css';

const Player = () => {
  const router = useRouter();
  const { slug, id, sectionId } = router.query;
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (!id || !sectionId) return;

    const fetchChannel = async () => {
      const channelDoc = await getDoc(doc(db, 'sections', sectionId, 'channels', id));
      if (channelDoc.exists()) {
        setChannel(channelDoc.data());
      }
    };

    fetchChannel();
  }, [id, sectionId]);

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
        {channel && (
          <>
            <div className={styles.playerContainer}>
              <VideoPlayer streamUrl={channel.streamUrl} />
              <a href="#" className={styles.telegramLink}>Join us on Telegram</a>
            </div>
            <section className={styles.infoSection}>
              <h2>{channel.name}</h2>
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
          </>
        )}
      </main>
    </div>
  );
};

export default Player;
