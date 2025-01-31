// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCP75i26r2R5Hj0f1He8jyk7UBhLJuVjLo",
  authDomain: "cgpacla-42a42.firebaseapp.com",
  projectId: "cgpacla-42a42",
  storageBucket: "cgpacla-42a42.firebasestorage.app",
  messagingSenderId: "772707474231",
  appId: "1:772707474231:web:4a23c69b8b3e07732dd8b2"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Authentication instance
const auth = getAuth(app);

export { auth };