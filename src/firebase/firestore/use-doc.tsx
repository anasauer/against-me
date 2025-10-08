'use client';

import { useFirestore } from '@/firebase/provider';
import type { DocumentReference } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export function useDoc<T>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      ref,
      (doc) => {
        if (doc.exists()) {
          setData(doc.data() as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching document:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, ref]);

  return { data, loading };
}
