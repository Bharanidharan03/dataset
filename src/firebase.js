import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Placeholder config - User needs to provide actual keys
const firebaseConfig = {
    apiKey: "AIzaSyCDYamrxiAw_fTVp2CHXOlvRy3qm2CKHYA",
    authDomain: "dataset-7ba96.firebaseapp.com",
    projectId: "dataset-7ba96",
    storageBucket: "dataset-7ba96.firebasestorage.app",
    messagingSenderId: "530660234150",
    appId: "1:530660234150:web:23496d147958c3e51c3567",
    measurementId: "G-H20BEV5GF8"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
