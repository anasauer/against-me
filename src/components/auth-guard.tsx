'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './logo';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return; // Don't do anything until all data is loaded
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
        if (!isWelcomeRoute) {
          targetRoute = welcomeRoute;
        }
      } else {
        // User has completed onboarding.
        if (isPublicRoute || isWelcomeRoute) {
          targetRoute = '/';
        }
      }
    }

    if (targetRoute && pathname !== targetRoute) {
      router.push(targetRoute);
    } else {
      // If no redirection is needed, we can show the content.
      setIsVerified(true);
    }
  }, [user, userData, isLoading, pathname, router]);

  if (!isVerified) {
    return <Loader />;
  }

  return <>{children}</>;
}
