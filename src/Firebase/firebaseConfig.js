// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz2pzZN19R-b3_obMnI9jWzF4xy5-2XuA",
  authDomain: "administrasjon.firebaseapp.com",
  projectId: "administrasjon",
  storageBucket: "administrasjon.appspot.com",
  messagingSenderId: "1018453494625",
  appId: "1:1018453494625:web:4f1a40415bba54ca81d320"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);