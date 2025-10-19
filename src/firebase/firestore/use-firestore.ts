'use client';
import { useContext } from 'react';
import type { Firestore } from 'firebase/firestore';
import { FirestoreContext } from '@/firebase/provider';

export function useFirestore(): Firestore | null {
  const context = useContext(FirestoreContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context;
}
