'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './logo';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';

const publicRoutes = ['/login', '/signup'];
const welcomeRoute = '/welcome';

function Loader() {
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

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const pathname = usePathname();
  const router = useRouter();

  const userDocRef = useMemo(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userData, loading: userLoading } = useDoc<UserProfile>(userDocRef);

  const isLoading = authLoading || (user && userLoading);

  useEffect(() => {
    // Wait until loading is complete before making routing decisions
    if (isLoading) {
      return; 
    }

    const isPublicRoute = publicRoutes.includes(pathname);
    const isWelcomeRoute = pathname === welcomeRoute;
    const hasCompletedOnboarding = userData?.hasCompletedOnboarding;

    let targetRoute: string | null = null;

    if (!user) {
      // User is not logged in.
      if (!isPublicRoute) {
        targetRoute = '/login';
      }
    } else {
      // User is logged in.
      if (!hasCompletedOnboarding) {
        // User has not completed onboarding, must be on welcome route
        if (!isWelcomeRoute) {
          targetRoute = welcomeRoute;
        }
      } else {
        // User has completed onboarding, should not be on public or welcome routes
        if (isPublicRoute || isWelcomeRoute) {
          targetRoute = '/';
        }
      }
    }

    if (targetRoute && pathname !== targetRoute) {
      router.push(targetRoute);
    }
  }, [user, userData, isLoading, pathname, router]);

  // While loading, show the loader to prevent content flash
  if (isLoading) {
    return <Loader />;
  }
  
  // Prevent rendering children if a redirection is pending
  const isPublicRoute = publicRoutes.includes(pathname);
  const isWelcomeRoute = pathname === welcomeRoute;

  if (!user && !isPublicRoute) {
    return <Loader />;
  }

  if (user && userData?.hasCompletedOnboarding === false && !isWelcomeRoute) {
     return <Loader />;
  }

  if (user && userData?.hasCompletedOnboarding && (isPublicRoute || isWelcomeRoute)) {
     return <Loader />;
  }

  return <>{children}</>;
}
