
/**
 * Firebase client configuration.
 * All values are pulled from environment variables with NEXT_PUBLIC_ prefix.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Runtime debug logs to verify environment variable loading
if (typeof window !== "undefined") {
  if (!firebaseConfig.projectId || firebaseConfig.projectId === "undefined") {
    console.error("❌ ERROR: Firebase Project ID is missing. Check your .env file.");
  } else {
    console.log("🔥 Firebase initialized for project:", firebaseConfig.projectId);
  }
}

export const isConfigValid = 
  !!firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "undefined" &&
  !!firebaseConfig.projectId &&
  firebaseConfig.projectId !== "undefined";
