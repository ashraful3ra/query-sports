import { useState, useEffect } from 'react';
import { db, storage } from '../utils/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import styles from '../styles/AdminPanel.module.css';

const AdminPanel = () => {
  const [sectionName, setSectionName] = useState('');
  const [channelName, setChannelName] = useState('');
  const [channelLogo, setChannelLogo] = useState(null);
  const [streamUrl, setStreamUrl] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [sliderImages, setSliderImages] = useState([]);
  const [editingSlider, setEditingSlider] = useState(null);
  const [editingChannel, setEditingChannel] = useState(null);
  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    const unsubscribeSections = onSnapshot(collection(db, 'sections'), snapshot => {
      const sectionsData = snapshot.docs.map(async (doc) => {
        const channelsSnapshot = await getDocs(collection(db, 'sections', doc.id, 'channels'));
        const channels = channelsSnapshot.docs.map(channelDoc => ({ id: channelDoc.id, ...channelDoc.data() }));
        return { id: doc.id, ...doc.data(), channels };
      });
      Promise.all(sectionsData).then(setSections);
    });

    const unsubscribeSlider = onSnapshot(collection(db, 'slider'), snapshot => {
      const sliderData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSliderImages(sliderData);
    });

    return () => {
      unsubscribeSections();
      unsubscribeSlider();
    };
  }, []);

  const addSection = async () => {
    if (sectionName.trim()) {
      await addDoc(collection(db, 'sections'), { name: sectionName });
      setSectionName('');
    }
  };

  const updateSection = async () => {
    if (editingSection && sectionName.trim()) {
      await updateDoc(doc(db, 'sections', editingSection.id), { name: sectionName });
      setSectionName('');
      setEditingSection(null);
    }
  };

  const deleteSection = async (id) => {
    await deleteDoc(doc(db, 'sections', id));
  };

  const addChannel = async () => {
    if (selectedSection && channelName.trim() && streamUrl.trim() && channelLogo) {
      const logoRef = ref(storage, `logos/${channelLogo.name}`);
      await uploadBytes(logoRef, channelLogo);
      const logoUrl = await getDownloadURL(logoRef);

      await addDoc(collection(db, 'sections', selectedSection, 'channels'), {
        name: channelName,
        logo: logoUrl,
        streamUrl,
      });

      setChannelName('');
      setStreamUrl('');
      setChannelLogo(null);
    }
  };

  const updateChannel = async () => {
    if (editingChannel && selectedSection && channelName.trim() && streamUrl.trim()) {
      let logoUrl = editingChannel.logo; // Use existing logo URL if not changed
      if (channelLogo) {
        const logoRef = ref(storage, `logos/${channelLogo.name}`);
        await uploadBytes(logoRef, channelLogo);
        logoUrl = await getDownloadURL(logoRef);
      }

      await updateDoc(doc(db, 'sections', selectedSection, 'channels', editingChannel.id), {
        name: channelName,
        logo: logoUrl,
        streamUrl,
      });

      setChannelName('');
      setStreamUrl('');
      setChannelLogo(null);
      setEditingChannel(null);
    }
  };

  const deleteChannel = async (sectionId, channelId, logoUrl) => {
    await deleteDoc(doc(db, 'sections', sectionId, 'channels', channelId));
    const logoRef = ref(storage, logoUrl);
    await deleteObject(logoRef);
  };

  const addSliderImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageRef = ref(storage, `slider/${file.name}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, 'slider'), { url: imageUrl });
    }
  };

  const updateSliderImage = async (e) => {
    const file = e.target.files[0];
    if (file && editingSlider) {
      const imageRef = ref(storage, `slider/${file.name}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);

      await updateDoc(doc(db, 'slider', editingSlider.id), { url: imageUrl });
      setEditingSlider(null);
    }
  };

  const deleteSliderImage = async (id, imageUrl) => {
    await deleteDoc(doc(db, 'slider', id));
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  };

  const startEditingSection = (section) => {
    setEditingSection(section);
    setSectionName(section.name);
  };

  const startEditingChannel = (sectionId, channel) => {
    setEditingChannel({ ...channel, sectionId });
    setSelectedSection(sectionId);
    setChannelName(channel.name);
    setStreamUrl(channel.streamUrl);
  };

  return (
    <div className={styles.adminContainer}>
      <h1>Admin Panel</h1>

      <div className={styles.formSection}>
        <h2>{editingSection ? 'Edit Section' : 'Add Section'}</h2>
        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          placeholder="Section Name"
          className={styles.input}
        />
        <button onClick={editingSection ? updateSection : addSection} className={styles.button}>
          {editingSection ? 'Update Section' : 'Add Section'}
        </button>
        {editingSection && (
          <button onClick={() => { setEditingSection(null); setSectionName(''); }} className={styles.button}>Cancel</button>
        )}
      </div>

      <div className={styles.formSection}>
        <h2>{editingChannel ? 'Edit Channel' : 'Add Channel'}</h2>
        <select onChange={(e) => setSelectedSection(e.target.value)} className={styles.select} value={selectedSection}>
          <option value="">Select Section</option>
          {sections.map(section => (
            <option key={section.id} value={section.id}>{section.name}</option>
          ))}
        </select>
        <input
          type="text"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="Channel Name"
          className={styles.input}
        />
        <input
          type="file"
          onChange={(e) => setChannelLogo(e.target.files[0])}
          className={styles.input}
        />
        <input
          type="text"
          value={streamUrl}
          onChange={(e) => setStreamUrl(e.target.value)}
          placeholder="Stream URL"
          className={styles.input}
        />
        <button onClick={editingChannel ? updateChannel : addChannel} className={styles.button}>
          {editingChannel ? 'Update Channel' : 'Add Channel'}
        </button>
        {editingChannel && (
          <button onClick={() => { setEditingChannel(null); setChannelName(''); setStreamUrl(''); setChannelLogo(null); }} className={styles.button}>Cancel</button>
        )}
      </div>

      <div className={styles.formSection}>
        <h2>{editingSlider ? 'Edit Slider Image' : 'Add Slider Image'}</h2>
        <input
          type="file"
          onChange={editingSlider ? updateSliderImage : addSliderImage}
          className={styles.input}
        />
        {editingSlider && (
          <button onClick={() => setEditingSlider(null)} className={styles.button}>Cancel</button>
        )}
      </div>

      <div className={styles.sectionList}>
        <h2>Sections</h2>
        <ul>
          {sections.map(section => (
            <li key={section.id} className={styles.sectionItem}>
              <h3>{section.name}</h3>
              <button onClick={() => startEditingSection(section)} className={styles.button}>Edit</button>
              <button onClick={() => deleteSection(section.id)} className={styles.button}>Delete</button>
              <ul>
                {section.channels.map(channel => (
                  <li key={channel.id} className={styles.channelItem}>
                    <img src={channel.logo} alt="Channel" className={styles.channelImage} />
                    <span>{channel.name}</span>
                    <button onClick={() => startEditingChannel(section.id, channel)} className={styles.button}>Edit</button>
                    <button onClick={() => deleteChannel(section.id, channel.id, channel.logo)} className={styles.button}>Delete</button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.sectionList}>
        <h2>Slider Images</h2>
        <ul>
          {sliderImages.map(image => (
            <li key={image.id} className={styles.sectionItem}>
              <img src={image.url} alt="Slider" className={styles.sliderImage} />
              <button onClick={() => setEditingSlider(image)} className={styles.button}>Edit</button>
              <button onClick={() => deleteSliderImage(image.id, image.url)} className={styles.button}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
