import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, query, orderBy, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAiHTTSW2QyOVJeDsKv8ED_7CcPiGsPxoA",
  authDomain: "futbol-porra.firebaseapp.com",
  projectId: "futbol-porra",
  storageBucket: "futbol-porra.firebasestorage.app",
  messagingSenderId: "223753631811",
  appId: "1:223753631811:web:3358477bacb9118812bcf6",
  measurementId: "G-YBH31RFEMQ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Exportamos todo lo necesario
export { 
  auth, 
  db, 
  googleProvider,
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  doc, setDoc, getDoc, onSnapshot, collection, query, orderBy, addDoc, updateDoc 
};