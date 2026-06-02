import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVmQFxZTbjNpTqSrs9uDv-lEgre932-F0",
  authDomain: "exam-results-app-4e445.firebaseapp.com",
  projectId: "exam-results-app-4e445",
  storageBucket: "exam-results-app-4e445.firebasestorage.app",
  messagingSenderId: "295569203394",
  appId: "1:295569203394:web:728cd906c58e37c7c15b5b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
