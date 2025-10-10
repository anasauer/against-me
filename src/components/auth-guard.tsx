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
  const [isRedirecting, setIsRedirecting] = useState(false);

  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userData, loading: userLoading } = useDoc<AppUser>(userDocRef);

  // Overall loading state
  const isLoading = authLoading || (user && userLoading);

  useEffect(() => {
    // Wait until loading is complete before doing anything
    if (isLoading) return;

    const isPublic = publicRoutes.includes(pathname);
    const isOnboarding = pathname === onboardingRoute;

    // If there's no user and the route is not public, redirect to login.
    if (!user && !isPublic) {
      router.push('/login');
      setIsRedirecting(true);
      return;
    }

    // If there is a user, handle routing logic.
    if (user) {
      const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;

      // If user is on a login/signup route, redirect to home.
      if (isPublic) {
        router.push('/');
        setIsRedirecting(true);
        return;
      }

      // If user HAS NOT completed onboarding and is NOT on the welcome page, redirect there.
      if (!hasCompletedOnboarding && !isOnboarding) {
        router.push(onboardingRoute);
        setIsRedirecting(true);
        return;
      }
      
      // If user HAS completed onboarding and is on the welcome page, redirect home.
      if (hasCompletedOnboarding && isOnboarding) {
          router.push('/');
          setIsRedirecting(true);
          return;
      }
    }
    
    setIsRedirecting(false);

  }, [user, userData, isLoading, router, pathname]);

  // While loading or redirecting, show a loading screen.
  // This prevents children from rendering prematurely during transitions.
  if (isLoading || isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Logo className="w-24 h-24 mb-4 animate-pulse" />
        <p className="text-muted-foreground flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            Cargando...
        </p>
      </div>
    );
  }

  // If all checks pass, render the children.
  return <>{children}</>;
}
