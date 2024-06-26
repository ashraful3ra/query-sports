import { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import slugify from 'slugify';
import styles from '../styles/ChannelList.module.css';

const ChannelList = ({ selectedSection }) => {
  const [channels, setChannels] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (selectedSection) {
      const unsubscribe = onSnapshot(
        collection(db, 'sections', selectedSection, 'channels'),
        snapshot => {
          const channelsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setChannels(channelsData);
        }
      );

      return () => unsubscribe();
    }
  }, [selectedSection]);

  const handleChannelClick = channel => {
    const slug = slugify(channel.name, { lower: true });
    router.push(`/player/${slug}?id=${channel.id}&sectionId=${selectedSection}`);
  };

  return (
    <div className={styles.channelList}>
      {channels.map(channel => (
        <div key={channel.id} className={styles.channelItem} onClick={() => handleChannelClick(channel)}>
          <img src={channel.logo} alt={`${channel.name} logo`} className={styles.channelLogo} />
        </div>
      ))}
    </div>
  );
};

export default ChannelList;
