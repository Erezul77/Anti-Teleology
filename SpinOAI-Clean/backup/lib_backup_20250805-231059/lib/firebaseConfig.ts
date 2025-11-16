import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Temporary hardcoded config for testing
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "spinoapp.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "spinoapp", // Force correct project ID
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "spinoapp.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

// Debug logging
console.log('Firebase Config Debug:', {
  apiKey: firebaseConfig.apiKey ? 'SET' : 'MISSING',
  authDomain: firebaseConfig.authDomain ? 'SET' : 'MISSING',
  projectId: firebaseConfig.projectId ? 'SET' : 'MISSING',
  storageBucket: firebaseConfig.storageBucket ? 'SET' : 'MISSING',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'SET' : 'MISSING',
  appId: firebaseConfig.appId ? 'SET' : 'MISSING',
});

console.log('Project ID:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
