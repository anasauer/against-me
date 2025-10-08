'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './logo';
import { doc } from 'firebase/firestore';

type AppUser = {
  hasCompletedOnboarding?: boolean;
};

// Define which routes are public and don't require authentication
const publicRoutes = ['/login', '/signup'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();

  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userData, loading: userLoading } = useDoc<AppUser>(userDocRef);
  
  // Overall loading state
  const isLoading = authLoading || (user && userLoading);
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Wait until loading is complete before doing anything
    if (isLoading) return;

    // If there's no user and the route is not public, redirect to login.
    if (!user && !isPublicRoute) {
      router.push('/login');
      return;
    }

    // If there is a user, handle onboarding and public route access.
    if (user) {
      // If user is on a public route, redirect to home.
      if (isPublicRoute) {
        router.push('/');
        return;
      }

      // If user has not completed onboarding, redirect to welcome page.
      if (userData && !userData.hasCompletedOnboarding && pathname !== '/welcome') {
        router.push('/welcome');
        return;
      }
      
      // If user has completed onboarding and is on welcome, redirect to home.
      if (userData && userData.hasCompletedOnboarding && pathname === '/welcome') {
          router.push('/');
          return;
      }
    }

  }, [user, userData, isLoading, router, pathname, isPublicRoute]);

  // While loading, or if we are about to redirect, show a loading screen.
  // This prevents children from rendering prematurely.
  if (isLoading || (!user && !isPublicRoute) || (user && (isPublicRoute || (userData && !userData.hasCompletedOnboarding && pathname !== '/welcome')))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Logo className="w-24 h-24 mb-4 animate-pulse" />
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  // If all checks pass, render the children.
  return <>{children}</>;
}
