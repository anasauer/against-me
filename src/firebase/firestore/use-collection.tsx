'use client';

import { useFirestore } from '@/firebase/provider';
import type {
  CollectionReference,
  DocumentData,
  Query,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';

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
        console.error('Error fetching collection:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, stableQuery]);

  return { data, loading };
}
