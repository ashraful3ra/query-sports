import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, onSnapshot } from "firebase/firestore";
import styles from '../styles/Slider.module.css';

const Slider = () => {
  const [sliderImages, setSliderImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'slider'), snapshot => {
      const imagesData = snapshot.docs.map(doc => doc.data().url);
      console.log("Fetched slider images:", imagesData); // Debug log
      setSliderImages(imagesData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (sliderImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % sliderImages.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [sliderImages.length]);

  if (sliderImages.length === 0) {
    return <div>Loading...</div>; // Show a loading message or a placeholder
  }

  return (
    <div className={styles.sliderContainer}>
      {sliderImages.map((url, index) => (
        <div
          key={index}
          className={`${styles.sliderImage} ${index === currentIndex ? styles.active : ''}`}
        >
          <img src={url} alt={`Slider ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default Slider;
