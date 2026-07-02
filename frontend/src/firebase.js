import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC2iYgRU8_km4-yeWjAG_zlp6zObedTQTY",
  authDomain: "medicalproject-9c885.firebaseapp.com",
  projectId: "medicalproject-9c885",
  storageBucket: "medicalproject-9c885.firebasestorage.app",
  messagingSenderId: "94651541452",
  appId: "1:94651541452:web:3db34a9369c733e9cadf69",
  measurementId: "G-RWFCB56R18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with local persistence (session survives refresh)
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(console.error);

// Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// GitHub Provider
// IMPORTANT: The Authorization callback URL in your GitHub OAuth App settings MUST be:
// https://medicalproject-9c885.firebaseapp.com/__/auth/handler
export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');
githubProvider.addScope('read:user');

// Sign-in helpers with logging
export const signInWithGoogle = async () => {
  console.log('[Auth] Starting Google sign-in via Firebase popup...');
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log('[Auth] Google sign-in success:', result.user.email);
    return result;
  } catch (err) {
    console.error('[Auth] Google sign-in failed:', err.code, err.message);
    throw err;
  }
};

export const signInWithGitHub = async () => {
  console.log('[Auth] Starting GitHub sign-in via Firebase popup...');
  console.log('[Auth] GitHub OAuth requires callback URL: https://medicalproject-9c885.firebaseapp.com/__/auth/handler');
  try {
    const result = await signInWithPopup(auth, githubProvider);
    console.log('[Auth] GitHub sign-in success:', result.user.email);
    return result;
  } catch (err) {
    console.error('[Auth] GitHub sign-in failed:', err.code, err.message);
    throw err;
  }
};

export const firebaseSignOut = () => signOut(auth);
export { onAuthStateChanged };

export default app;
