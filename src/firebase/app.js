// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPO9p2V2ITkSl-s848yJas_jAKBINyvig",
  authDomain: "together-b63e1.firebaseapp.com",
  projectId: "together-b63e1",
  storageBucket: "together-b63e1.firebasestorage.app",
  messagingSenderId: "343106296292",
  appId: "1:343106296292:web:4b88f16f59511e76254ff1",
  measurementId: "G-07YRPXJXGS"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);