
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBIaY2jmYNUpmvnKsb0nZrrWaeg3yXPZ7g",
  authDomain: "labelsorters.firebaseapp.com",
  projectId: "labelsorters",
  storageBucket: "labelsorters.appspot.com",
  messagingSenderId: "969929368865",
  appId: "1:969929368865:web:c3cf6f85585c59e0324a60",
  measurementId: "G-NH57ZD59K8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export {auth,provider};