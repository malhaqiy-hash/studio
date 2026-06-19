import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let firestore: Firestore;
let auth: Auth;
let storage: FirebaseStorage;
let messaging: Messaging | undefined;

/**
 * Initializes Firebase services safely using the singleton pattern.
 */
export function initializeFirebase() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
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

/**
 * messaging initializer needs to be async or guarded for SSR/Environment support
 */
export async function getMessagingInstance() {
  const supported = await isSupported();
  if (supported) {
    return getMessaging(app || getApp());
  }
  return undefined;
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
