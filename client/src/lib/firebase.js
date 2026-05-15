import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tu configuración de Firebase (copiada de tu consola)
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

// Exportamos todo lo necesario para que los demás componentes funcionen
export { db, doc, setDoc, getDoc, onSnapshot, collection, query, orderBy };