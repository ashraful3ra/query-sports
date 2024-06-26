import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRi7tbz8X-B1cnFvJG-RVNFHanB9h2bUY",
  authDomain: "live-tv-ebea7.firebaseapp.com",
  projectId: "live-tv-ebea7",
  storageBucket: "live-tv-ebea7.appspot.com",
  messagingSenderId: "57023759148",
  appId: "1:57023759148:web:a2ab242cb32f9ba04de289"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
  })
  .catch((error) => {
    console.error("Error signing in anonymously: ", error);
  });

export { db, storage };
