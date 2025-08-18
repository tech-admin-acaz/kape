// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCK06MasinVgp_lqAr0tBr4wWKl6XRgRM4",
  authDomain: "biodiversidade2.firebaseapp.com",
  projectId: "biodiversidade2",
  storageBucket: "biodiversidade2.firebasestorage.app",
  messagingSenderId: "134238563596",
  appId: "1:134238563596:web:162c679e2cae78c31e2d29"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };