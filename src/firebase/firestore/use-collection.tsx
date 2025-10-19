'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  getDocs,
  Query,
  DocumentData,
  FirestoreError,
  QueryConstraint,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase/firestore/use-firestore';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

interface CollectionState<T> {
  data: T[];
  isLoading: boolean;
  error: FirestoreError | null;
}

export function useCollection<T extends DocumentData>(
  queryInstance: Query<T> | null
): CollectionState<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!queryInstance) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      queryInstance,
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(documents);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path: (queryInstance as any)._query.path.segments.join('/'),
        });
        errorEmitter.emit('permission-error', contextualError);
        setError(error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [JSON.stringify(queryInstance)]);

  return { data, isLoading, error };
}
