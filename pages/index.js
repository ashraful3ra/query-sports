import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import ChannelList from '../components/ChannelList';
import Slider from '../components/Slider';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchSectionsWithChannels = async () => {
      const sectionsSnapshot = await getDocs(collection(db, 'sections'));
      const sectionsData = await Promise.all(
        sectionsSnapshot.docs.map(async (doc) => {
          const sectionData = { id: doc.id, ...doc.data() };
          const channelsSnapshot = await getDocs(collection(db, 'sections', doc.id, 'channels'));
          if (!channelsSnapshot.empty) {
            return sectionData;
          }
          return null;
        })
      );
      setSections(sectionsData.filter((section) => section !== null));
    };

    fetchSectionsWithChannels();
  }, []);

  return (
    <div className={styles.container}>
      <Slider />
      {sections.map((section) => (
        <div key={section.id} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.name}</h2>
          <ChannelList selectedSection={section.id} />
        </div>
      ))}
    </div>
  );
}
