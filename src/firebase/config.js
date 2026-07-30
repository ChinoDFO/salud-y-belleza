// src/firebase/config.js (o src/firebase.js)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCW8zuvK8ulj9t-STKiPnLvtpJT8S2UEbI",
  authDomain: "salud-y-belleza-1babc.firebaseapp.com",
  projectId: "salud-y-belleza-1babc",
  storageBucket: "salud-y-belleza-1babc.firebasestorage.app",
  messagingSenderId: "185338841020",
  appId: "1:185338841020:web:74f07ca898f70b73808db9",
  measurementId: "G-T0CW3GDVCV"
};

// 1. Inicializamos y exportamos 'app' en una sola línea
export const app = initializeApp(firebaseConfig);

// 2. Inicializamos Analytics (si lo estás usando)
export const analytics = getAnalytics(app);

// 3. Inicializamos y exportamos 'db'
export const db = getFirestore(app);