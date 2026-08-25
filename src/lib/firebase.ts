import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCkQP8wt0tOpvgva9S1XGXhRezC1LKogHQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'g12dashboard.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'g12dashboard',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'g12dashboard.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '650437422668',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:650437422668:web:647792edbbbdd0235f8ee9',
}

export const firebaseReady = true

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(config)
const auth: Auth = getAuth(app)
const db: Firestore = getFirestore(app)

export { app, auth, db }
