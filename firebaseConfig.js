import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCpWUSdSOit7jKhfe3w5RBcV5q9cJ59WrU",
    authDomain: "e-commerce-ce4e4.firebaseapp.com",
    projectId: "e-commerce-ce4e4",
    storageBucket: "e-commerce-ce4e4.firebasestorage.app",
    messagingSenderId: "748795535331",
    appId: "1:748795535331:web:fb2ac0c239b9cd0232cad6"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
