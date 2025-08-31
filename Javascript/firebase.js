import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7BWeqpm3Npk0KdDC0mBqR9pxpZZhx9Vc",
  authDomain: "signalsend-a67fb.firebaseapp.com",
  projectId: "signalsend-a67fb",
  storageBucket: "signalsend-a67fb.firebasestorage.app",
  messagingSenderId: "6695142179",
  appId: "1:6695142179:web:1b7c26aec9ef56fc2cc296",
  measurementId: "G-2WDHFZHDFT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);