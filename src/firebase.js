import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCVDToZSxqElvOy55HYhDFIBA3mUCx6H_c",
    authDomain: "book-catalog-9e85c.firebaseapp.com",
    projectId: "book-catalog-9e85c",
    storageBucket: "book-catalog-9e85c.appspot.com",
    messagingSenderId: "90620269235",
    appId: "1:90620269235:web:dfee31758ca33e1f2a96c6",
    measurementId: "G-5QXK979ZBD"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };