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
  
  const isLoading = authLoading || userLoading;

  useEffect(() => {
    if (isLoading) return; // Wait for all data to load

    const isPublicRoute = publicRoutes.includes(pathname);
    const isWelcomeRoute = pathname === welcomeRoute;
    const hasCompletedOnboarding = userData?.hasCompletedOnboarding;

    // Not logged in
    if (!user) {
      if (!isPublicRoute && !isWelcomeRoute) {
        router.push('/login');
      }
      return;
    }

    // Logged in, but onboarding not complete
    if (!hasCompletedOnboarding) {
      if (!isWelcomeRoute) {
        router.push(welcomeRoute);
      }
      return;
    }

    // Logged in and onboarding complete
    if (hasCompletedOnboarding) {
      if (isPublicRoute || isWelcomeRoute) {
        router.push('/');
      }
      return;
    }

  }, [user, userData, isLoading, pathname, router]);


  // Determine if we should show the loader or the content
  const showLoader = () => {
    if (isLoading) return true;

    const hasCompletedOnboarding = userData?.hasCompletedOnboarding;

    // While redirecting, show loader
    if (!user && !publicRoutes.includes(pathname) && pathname !== welcomeRoute) return true;
    if (user && !hasCompletedOnboarding && pathname !== welcomeRoute) return true;
    if (user && hasCompletedOnboarding && (publicRoutes.includes(pathname) || pathname === welcomeRoute)) return true;

    return false;
  }

  if (showLoader()) {
    return <Loader />;
  }

  return <>{children}</>;
}
