'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from './logo';
import { doc } from 'firebase/firestore';

type AppUser = {
  hasCompletedOnboarding?: boolean;
};

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userData, loading: userLoading } = useDoc<AppUser>(userDocRef);
  
  const loading = authLoading || userLoading;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (user && userData && !userData.hasCompletedOnboarding) {
        router.push('/welcome');
        return;
    }

  }, [user, userData, loading, router]);

  if (loading || !user || (user && !userData?.hasCompletedOnboarding)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Logo className="w-24 h-24 mb-4 animate-pulse" />
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return <>{children}</>;
}
