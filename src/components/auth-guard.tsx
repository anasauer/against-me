'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from './logo';
import { doc } from 'firebase/firestore';

type AppUser = {
  hasCompletedOnboarding?: boolean;
};

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();

  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userData, loading: userLoading } = useDoc<AppUser>(userDocRef);
  
  const loading = authLoading || userLoading;

  useEffect(() => {
    if (loading) return;

    // If no user, redirect to login, unless they are already on a public page.
    if (!user) {
      if (pathname !== '/login' && pathname !== '/signup') {
        router.push('/login');
      }
      return;
    }

    // If user is logged in but hasn't completed onboarding, redirect to welcome.
    if (userData && !userData.hasCompletedOnboarding) {
        if (pathname !== '/welcome') {
          router.push('/welcome');
        }
        return;
    }

    // If user is logged in, has completed onboarding, but is on a public page, redirect to home.
    if (userData && userData.hasCompletedOnboarding) {
        if (pathname === '/login' || pathname === '/signup' || pathname === '/welcome') {
            router.push('/');
        }
    }

  }, [user, userData, loading, router, pathname]);

  // Show loading screen while checking auth status or if a redirect is imminent.
  if (loading || !user || (user && userData && !userData.hasCompletedOnboarding && pathname !== '/welcome')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Logo className="w-24 h-24 mb-4 animate-pulse" />
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return <>{children}</>;
}
