import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5-SEH9UQ_OxWiGIetOZijo6U2Lm0mx8k",
  authDomain: "oauth2-31caf.firebaseapp.com",
  projectId: "oauth2-31caf",
  storageBucket: "oauth2-31caf.appspot.com",
  messagingSenderId: "111265557249",
  appId: "1:111265557249:web:636fd0ee96cf01c68a0900",
  measurementId: "G-QX11FT8PPR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure authentication settings
auth.settings.appVerificationDisabledForTesting = false;
auth.languageCode = 'en'; // Set default language

const actionCodeSettings = {
  url: window.location.origin + '/verify-email',
  handleCodeInApp: true
};

export { auth, googleProvider, analytics, actionCodeSettings };
export default app; 