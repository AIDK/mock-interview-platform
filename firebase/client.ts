import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAntlbQYBpqsp0zAiZi1r__k2ldShonw84",
  authDomain: "preppi-61d01.firebaseapp.com",
  projectId: "preppi-61d01",
  storageBucket: "preppi-61d01.firebasestorage.app",
  messagingSenderId: "134810214403",
  appId: "1:134810214403:web:f5d8429db3e741a59a2e36",
  measurementId: "G-9ZGN5ZSKG8",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
