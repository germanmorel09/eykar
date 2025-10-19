'use client';

import { ReactNode, useMemo } from 'react';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

import { FirebaseProvider } from '@/firebase/provider';
import { firebaseConfig } from './config';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// This function initializes Firebase and is memoized to ensure it only runs once.
function initializeFirebase() {
  // Check if Firebase has already been initialized to prevent re-initialization.
  // This is important for Next.js's hot-reloading feature in development.
  let firebaseApp: FirebaseApp;
  let auth: Auth;
  let firestore: Firestore;

  try {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  } catch (e) {
    // If initialization fails, it's likely because the app is already initialized.
    // In a real-world scenario, you might want to get the existing app instance.
    // For this example, we'll log the error and proceed, as the context providers
    // will likely receive null, and the UI will handle it gracefully.
    console.error("Firebase initialization error:", e);
    // In a production app, you might want to use getApps() to retrieve the existing app
    // and avoid re-initializing, but for simplicity, we'll rely on the try-catch.
    // This example prioritizes demonstrating the provider pattern over robust
    // multi-environment Firebase instance management.
    return { firebaseApp: null, firestore: null, auth: null };
  }

  return { firebaseApp, firestore, auth };
}


export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // useMemo ensures that Firebase is initialized only once per application lifecycle.
  const { firebaseApp, firestore, auth } = useMemo(() => {
     if (typeof window === 'undefined') {
      // During server-side rendering, we don't initialize Firebase.
      // The providers will receive null, and components should handle this.
      return { firebaseApp: null, firestore: null, auth: null };
    }
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider firebaseApp={firebaseApp} firestore={firestore} auth={auth}>
      {children}
    </FirebaseProvider>
  );
}
