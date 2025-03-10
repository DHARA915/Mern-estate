// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-3cd4d.firebaseapp.com",
  projectId: "mern-estate-3cd4d",
  storageBucket: "mern-estate-3cd4d.firebasestorage.app",
  messagingSenderId: "569497795078",
  appId: "1:569497795078:web:a8da6c2a6da3bdcaeae187"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);