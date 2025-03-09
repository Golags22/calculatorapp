// Import necessary Firebase modules
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

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
const auth = getAuth(app);
const db = getFirestore(app);

// Function to create a new user and send a verification email
const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Send verification email
    await sendEmailVerification(user);
    console.log('Verification email sent.');
    
    return user;
  } catch (error) {
    console.error('Error creating user:', error.message);
  }
};

// Function to log in only if the email is verified
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      console.log('Login successful');
      return user;
    } else {
      console.log('Please verify your email before logging in.');
      await signOut(auth); // Prevent login if email is not verified
      return null;
    }
  } catch (error) {
    console.error('Error logging in:', error.message);
  }
};

// Export Firebase Auth and Firestore references to use in your app
export { auth, db, registerUser, loginUser, signOut, setDoc, doc, getDoc, collection, addDoc, deleteDoc };
