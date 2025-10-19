'use client';
import { useContext } from 'react';
import type { Auth } from 'firebase/auth';
import { AuthContext } from '@/firebase/provider';

export function useAuth(): Auth | null {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context;
}
