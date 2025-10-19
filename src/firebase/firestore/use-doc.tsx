'use client';

import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, DocumentReference, DocumentData, FirestoreError } from 'firebase/firestore';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

interface DocState<T> {
  data: T | null;
  isLoading: boolean;
  error: FirestoreError | null;
}

export function useDoc<T extends DocumentData>(
  docRef: DocumentReference<T> | null
): DocState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const memoizedDocRef = useMemo(() => docRef, [docRef?.path]);

  useEffect(() => {
    if (!memoizedDocRef) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: memoizedDocRef.path,
        })
        errorEmitter.emit('permission-error', contextualError);
        setError(error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef]);

  return { data, isLoading, error };
}
