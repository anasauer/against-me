'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './logo';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

type AppUser = {
  hasCompletedOnboarding?: boolean;
};

// Define which routes are public and don't require authentication
const publicRoutes = ['/login', '/signup'];
const onboardingRoute = '/welcome';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();
  
  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userData, loading: userLoading } = useDoc<AppUser>(userDocRef);

  const isLoading = authLoading || (user && userLoading);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Logo className="w-24 h-24 mb-4 animate-pulse" />
        <p className="text-muted-foreground flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cargando...
        </p>
      </div>
    );
  }

  const isPublic = publicRoutes.includes(pathname);
  const isOnboarding = pathname === onboardingRoute;

  // Case 1: User is not logged in
  if (!user) {
    if (!isPublic) {
      router.push('/login');
      // Return loading indicator while redirecting
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Logo className="w-24 h-24 mb-4 animate-pulse" />
          <p className="text-muted-foreground flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cargando...
          </p>
        </div>
      );
    }
    return <>{children}</>;
  }

  // Case 2: User is logged in
  const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;

  if (isPublic) {
    router.push('/');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Logo className="w-24 h-24 mb-4 animate-pulse" />
        <p className="text-muted-foreground flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cargando...
        </p>
      </div>
    );
  }

  if (!hasCompletedOnboarding && !isOnboarding) {
    router.push(onboardingRoute);
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Logo className="w-24 h-24 mb-4 animate-pulse" />
        <p className="text-muted-foreground flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cargando...
        </p>
      </div>
    );
  }

  if (hasCompletedOnboarding && isOnboarding) {
    router.push('/');
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Logo className="w-24 h-24 mb-4 animate-pulse" />
        <p className="text-muted-foreground flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cargando...
        </p>
      </div>
    );
  }
  
  // If no redirection is needed, show the content
  return <>{children}</>;
}
