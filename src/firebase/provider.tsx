'use client';

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { createContext, memo, useContext, type ReactNode } from 'react';

const FirebaseContext = createContext<{
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}>({
  firebaseApp: null,
  auth: null,
  firestore: null,
});

export const useFirebase = () => useContext(FirebaseContext);

export const useFirebaseApp = () => {
  const { firebaseApp } = useContext(FirebaseContext);

  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Did you forget to wrap your app in a <FirebaseProvider>?');
  }

  return firebaseApp;
};

export const useAuth = () => {
  const { auth } = useContext(FirebaseContext);

  if (!auth) {
    throw new Error('Firebase Auth not initialized. Did you forget to wrap your app in a <FirebaseProvider>?');
  }

  return auth;
};

export const useFirestore = () => {
  const { firestore } = useContext(FirebaseContext);

  if (!firestore) {
    throw new Error('Firestore not initialized. Did you forget to wrap your app in a <FirebaseProvider>?');
  }

  return firestore;
};

const FirebaseProvider = memo(function FirebaseProvider({
  children,
  firebaseApp,
  auth,
  firestore,
}: {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) {
  return (
    <FirebaseContext.Provider
      value={{
        firebaseApp,
        auth,
        firestore,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
});

export { FirebaseProvider };
