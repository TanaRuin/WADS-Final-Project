import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5-SEH9UQ_OxWiGIetOZijo6U2Lm0mx8k",
  authDomain: "oauth2-31caf.firebaseapp.com",
  projectId: "oauth2-31caf",
  storageBucket: "oauth2-31caf.firebasestorage.app",
  messagingSenderId: "111265557249",
  appId: "1:111265557249:web:636fd0ee96cf01c68a0900",
  measurementId: "G-QX11FT8PPR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export default app; 