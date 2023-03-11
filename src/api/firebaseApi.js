import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"



const firebaseConfig = {
    apiKey: "AIzaSyC8YDzKmuhlXNMcVZwBHKJYLLtC9tdjsKQ",
    authDomain: "ajna-tools.firebaseapp.com",
    projectId: "ajna-tools",
    storageBucket: "ajna-tools.appspot.com",
    messagingSenderId: "501101593235",
    appId: "1:501101593235:web:ac6fadcf395602d4ac0366",
    measurementId: "G-EFG8745VK1"
  };

 

export const fb = initializeApp(firebaseConfig);

export const auth = getAuth();


/* onAuthStateChanged(auth, (u) => {
  if (u) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    localStorage.setItem('userId',u.uid);
    console.log('Auth',u)
    // ...
  } else {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    
  }
});   */

export const storage = getStorage(fb);
export const db = getFirestore();


  