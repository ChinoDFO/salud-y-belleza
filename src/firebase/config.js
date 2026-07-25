// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCW8zuvK8ulj9t-STKiPnLvtpJT8S2UEbI",
  authDomain: "salud-y-belleza-1babc.firebaseapp.com",
  projectId: "salud-y-belleza-1babc",
  storageBucket: "salud-y-belleza-1babc.firebasestorage.app",
  messagingSenderId: "185338841020",
  appId: "1:185338841020:web:74f07ca898f70b73808db9",
  measurementId: "G-T0CW3GDVCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Exportar la instancia de Firestore para usarla en tus componentes
export const db = getFirestore(app);