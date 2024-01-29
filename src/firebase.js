// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2Fy6D0yoltdG6oUgf8p8Bca3j10mU1_w",
  authDomain: "realtor-clone-1c9b3.firebaseapp.com",
  projectId: "realtor-clone-1c9b3",
  storageBucket: "realtor-clone-1c9b3.appspot.com",
  messagingSenderId: "162405083543",
  appId: "1:162405083543:web:ee76fca4758ce655e97cd2"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();