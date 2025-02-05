import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBgikvsur0oHXH3al8oa8sQwKQ58FHPwMY",
  authDomain: "cashier-thru.firebaseapp.com",
  databaseURL: "https://cashier-thru-default-rtdb.firebaseio.com",
  projectId: "cashier-thru",
  storageBucket: "cashier-thru.firebasestorage.app",
  messagingSenderId: "675561190760",
  appId: "1:675561190760:web:1d0cc394c3bc113aa452dd",
  measurementId: "G-C5EM0V4EH6",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
