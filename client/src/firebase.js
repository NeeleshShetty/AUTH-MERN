
import { initializeApp } from 'firebase/app';


const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'mern-auth-447c1.firebaseapp.com',
	projectId: 'mern-auth-447c1',
	storageBucket: 'mern-auth-447c1.appspot.com',
	messagingSenderId: '1012488870670',
	appId: '1:1012488870670:web:b7f5ce60f3dfa86662555f',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
