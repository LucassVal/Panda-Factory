/**
 * 🔥 Firebase Configuration and Hooks
 * ====================================
 * Core Firebase connections for Panda Factory
 */

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, get, set, onValue, off } from "firebase/database";

/**
 * Firebase Configuration
 * Replace with your actual Firebase config
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-app.firebaseapp.com",
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    "https://your-app.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-app",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-app.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123",
};

// Initialize Firebase
let app;
let auth;
let database;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  database = getDatabase(app);
  console.log("🔥 Firebase initialized");
} catch (error) {
  console.warn(
    "Firebase initialization failed, using mock mode:",
    error.message,
  );
}

/**
 * Google Auth Provider
 */
const googleProvider = new GoogleAuthProvider();

/**
 * Firebase Auth Functions
 */
export const firebaseAuth = {
  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    if (!auth) throw new Error("Firebase not initialized");
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  },

  /**
   * Sign in with Email/Password
   */
  async signInWithEmail(email, password) {
    if (!auth) throw new Error("Firebase not initialized");
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  },

  /**
   * Sign out
   */
  async signOut() {
    if (!auth) throw new Error("Firebase not initialized");
    await signOut(auth);
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    return auth?.currentUser || null;
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChanged(callback) {
    if (!auth) return () => {};
    return onAuthStateChanged(auth, callback);
  },
};

/**
 * Firebase Realtime Database Functions
 */
export const firebaseDB = {
  /**
   * Get data at path
   */
  async get(path) {
    if (!database) throw new Error("Firebase not initialized");
    const snapshot = await get(ref(database, path));
    return snapshot.val();
  },

  /**
   * Set data at path
   */
  async set(path, data) {
    if (!database) throw new Error("Firebase not initialized");
    await set(ref(database, path), data);
  },

  /**
   * Subscribe to data changes
   */
  subscribe(path, callback) {
    if (!database) return () => {};
    const dbRef = ref(database, path);
    onValue(dbRef, (snapshot) => {
      callback(snapshot.val());
    });
    return () => off(dbRef);
  },

  /**
   * Get user status (online/offline)
   */
  async getUserStatus(uid) {
    return this.get(`users/${uid}/status`);
  },

  /**
   * Set user online status
   */
  async setUserOnline(uid) {
    return this.set(`users/${uid}/status`, {
      online: true,
      lastSeen: Date.now(),
    });
  },

  /**
   * Get system health
   */
  async getHealth() {
    return this.get("system/health");
  },

  /**
   * Get founder metrics
   */
  async getFounderMetrics() {
    const [treasury, users, usage, errors] = await Promise.all([
      this.get("metrics/treasury"),
      this.get("metrics/users"),
      this.get("metrics/usage"),
      this.get("metrics/errors"),
    ]);
    return { treasury, users, usage, errors };
  },
};

/**
 * Export Firebase instances for direct access
 */
export { app, auth, database };
export default { firebaseAuth, firebaseDB };
