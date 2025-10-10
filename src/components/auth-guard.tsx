'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useLayoutEffect } from 'react';
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
  const [isRedirecting, setIsRedirecting] = useState(true); // Start as true

  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userData, loading: userLoading } = useDoc<AppUser>(userDocRef);

  const isLoading = authLoading || (user && userLoading);

  useLayoutEffect(() => {
    if (isLoading) {
      setIsRedirecting(true); // Keep redirecting state while loading
      return;
    }

    const isPublic = publicRoutes.includes(pathname);
    const isOnboarding = pathname === onboardingRoute;

    let targetRoute: string | null = null;

    if (!user) {
      if (!isPublic) {
        targetRoute = '/login';
      }
    } else {
      const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;
      if (isPublic) {
        targetRoute = '/';
      } else if (!hasCompletedOnboarding && !isOnboarding) {
        targetRoute = onboardingRoute;
      } else if (hasCompletedOnboarding && isOnboarding) {
        targetRoute = '/';
      }
    }

    if (targetRoute) {
      router.push(targetRoute);
      // setIsRedirecting will be handled by the subsequent render
    } else {
      setIsRedirecting(false); // No redirection needed, we can show children
    }
  }, [user, userData, isLoading, pathname, router]);

  if (isLoading || isRedirecting) {
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
