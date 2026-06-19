
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig, isConfigValid } from './config';

let app: FirebaseApp;
let firestore: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

/**
 * Initializes Firebase services safely using the singleton pattern.
 * This version implements experimentalForceLongPolling to prevent connectivity issues
 * commonly associated with gRPC in certain network environments.
 */
export function initializeFirebase() {
  if (!isConfigValid) {
    console.warn("Firebase configuration is missing or incomplete. Check your environment variables.");
  }

  // Ensure Singleton Pattern for Next.js Fast Refresh / Turbopack
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    // JURUS PAMUNGKAS: Force Long Polling to prevent "client is offline" errors
    firestore = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  } else {
    app = getApp();
    firestore = getFirestore(app);
  }

  auth = getAuth(app);
  storage = getStorage(app);

  return { firebaseApp: app, firestore, auth, storage };
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
