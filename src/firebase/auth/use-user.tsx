'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '@/firebase/auth/use-auth';

interface UserState {
  user: User | null;
  isUserLoading: boolean;
}

export function useUser(): UserState {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsUserLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsUserLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, isUserLoading };
}
