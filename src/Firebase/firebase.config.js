// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaHd3pPjo0uKplV5iZ-GqW1AJhc0xGtUY",
  authDomain: "air-office-28b26.firebaseapp.com",
  projectId: "air-office-28b26",
  storageBucket: "air-office-28b26.firebasestorage.app",
  messagingSenderId: "174590492923",
  appId: "1:174590492923:web:c72da38b4066a51ce5b05e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export default auth