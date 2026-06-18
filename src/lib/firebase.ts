
'use client';

/**
 * Convenience export for Firebase instances.
 * Note: Prefer using the hooks (useFirestore, useAuth) provided by the FirebaseProvider
 * for better integration with React's lifecycle.
 */
import { initializeFirebase } from '@/firebase';

const { firebaseApp, firestore, auth } = initializeFirebase();

export const app = firebaseApp;
export const db = firestore;
export { auth };
