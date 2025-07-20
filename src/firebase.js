// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYAStN1C8ZcKITbRau0t--PE_vrE2CNQE",
  authDomain: "news-aggregator-app-36129.firebaseapp.com",
  projectId: "news-aggregator-app-36129",
  storageBucket: "news-aggregator-app-36129.firebasestorage.app",
  messagingSenderId: "1055772980470",
  appId: "1:1055772980470:web:1f84b4e3cd8808a46068d7",
  measurementId: "G-1HJS5WCNC8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };