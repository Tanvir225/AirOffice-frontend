// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfv2o8mjka3t1MCdxinBH8MZorqT_oLfE",
  authDomain: "air-office-100.firebaseapp.com",
  projectId: "air-office-100",
  storageBucket: "air-office-100.firebasestorage.app",
  messagingSenderId: "96151625480",
  appId: "1:96151625480:web:c378bfc52cfa1ba6c296bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export default auth