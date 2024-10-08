import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: "meocamp-b6231.firebaseapp.com",
  projectId: "meocamp-b6231",
  storageBucket: "meocamp-b6231.appspot.com",
  messagingSenderId: "149549575885",
  appId: "1:149549575885:web:3fd3f396aa9debdd05c384",
  measurementId: "G-MXSBFMP1FB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);