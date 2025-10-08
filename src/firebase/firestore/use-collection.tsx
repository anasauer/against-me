'use client';

import { useFirestore } from '@/firebase/provider';
import type {
  CollectionReference,
  Query,
  FirestoreError,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Helper function to extract path from a Query or CollectionReference
function getQueryPath<T>(q: Query<T> | CollectionReference<T>): string {
    // It's a CollectionReference
  if ('path' in q) {
    return (q as CollectionReference<T>).path;
  }
  // For queries, we can try to get the collection id from the internal _query object.
  // This is a hack and might break, but it's better than 'unknown path'.
  // Firestore's JS SDK doesn't expose a public API for this.
  const internalQuery = q as any;
  if (internalQuery._query?.path?.segments) {
    return internalQuery._query.path.segments.join('/');
  }
  return 'unknown query path';
}


export function useCollection<T>(
  query: Query<T> | CollectionReference<T> | null
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  // Using JSON.stringify is a simple way to create a stable dependency, but it has limitations.
  // For complex queries, a more robust serialization might be needed.
  const stableQueryKey = useMemo(() => query ? JSON.stringify((query as any)._query) : null, [query]);


  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as object } as T));
        setData(data);
        setLoading(false);
      },
      (error: FirestoreError) => {
        const path = getQueryPath(query);
        const permissionError = new FirestorePermissionError({
          path: path,
          operation: 'list'
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, stableQueryKey]);

  return { data, loading };
}
