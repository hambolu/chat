
// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyC5BuK5EPePuPCo-pLwpErCNhbBzfHZ9lI",
    authDomain: "chat-app-516c1.firebaseapp.com",
    projectId: "chat-app-516c1",
    storageBucket: "chat-app-516c1.appspot.com",
    messagingSenderId: "756936003640",
    appId: "1:756936003640:web:29b57b291cec1cd66fd6cd"

  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
