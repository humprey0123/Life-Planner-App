// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // optional if you want a DB later



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7MUrjDdViy2E42GI3GsVEXVqgy7zOqAE",
  authDomain: "life-planner-app-ae27e.firebaseapp.com",
  projectId: "life-planner-app-ae27e",
  storageBucket: "life-planner-app-ae27e.firebasestorage.app",
  messagingSenderId: "71731344097",
  appId: "1:71731344097:web:08dab8d7daccce18033da0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and db
export const auth = getAuth(app);
export const db = getFirestore(app); // only if you want to use Firestore later
