import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjiiSXP8VXiR8t7ZLw7d2aAvydAKT771I",
  authDomain: "project4piu.firebaseapp.com",
  projectId: "project4piu",
  storageBucket: "project4piu.appspot.com",
  messagingSenderId: "140442664280",
  appId: "1:140442664280:web:b50655175380bf697a792d",
  measurementId: "G-P7L75TMR62",
};

// Initialize Firebase App (handle single instance)
const initFirebase = () => {
  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    return app;
  } else {
    return getApp(); // return the already initialized instance
  }
};

// Initialize Firebase
const app = initFirebase();
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, analytics, auth };

// Debugging the configuration
console.log("Firebase Config: ", firebaseConfig);
