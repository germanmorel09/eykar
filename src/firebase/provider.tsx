'use client';
import { createContext, ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

export const FirebaseAppContext = createContext<FirebaseApp | null>(null);
export const AuthContext = createContext<Auth | null>(null);
export const FirestoreContext = createContext<Firestore | null>(null);

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

export function FirebaseProvider({ children, firebaseApp, auth, firestore }: FirebaseProviderProps) {
  return (
    <FirebaseAppContext.Provider value={firebaseApp}>
      <AuthContext.Provider value={auth}>
        <FirestoreContext.Provider value={firestore}>
          {children}
        </FirestoreContext.Provider>
      </AuthContext.Provider>
    </FirebaseAppContext.Provider>
  );
}
