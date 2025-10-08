'use client';

import { useFirestore } from '@/firebase/provider';
import type {
  CollectionReference,
  Query,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useCollection<T>(
  query: Query<T> | CollectionReference<T> | null
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  const stableQuery = useMemo(() => query, [JSON.stringify(query)]);

  useEffect(() => {
    if (!stableQuery) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      stableQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as object } as T));
        setData(data);
        setLoading(false);
      },
      (error) => {
        const path = 'path' in stableQuery ? stableQuery.path : 'unknown path';
        const permissionError = new FirestorePermissionError({
          path: path,
          operation: 'list'
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, stableQuery]);

  return { data, loading };
}
