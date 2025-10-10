'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './logo';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


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
    if (isLoading) {
      return;
    }

    if (user && userData === null) {
      // User is authenticated, but no user document exists. Create it.
      // This handles users signing up with social providers like Google.
      const newUserProfile: UserProfile = {
        name: user.displayName || 'Nuevo Usuario',
        email: user.email?.toLowerCase() || '',
        avatar: user.photoURL || '',
        points: 0,
        dailyStreak: 0,
        weeklyStreak: 0,
        friends: [],
        hasCompletedOnboarding: false,
      };

      if (userDocRef) {
        setDoc(userDocRef, newUserProfile)
          .catch((error) => {
             const permissionError = new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'create',
              requestResourceData: newUserProfile,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
      }
      // The useDoc hook will automatically update `userData` after creation,
      // and the effect will re-run to handle redirection.
      return; 
    }

    const isPublicRoute = publicRoutes.includes(pathname);
    const isWelcomeRoute = pathname === welcomeRoute;
    const hasCompletedOnboarding = userData?.hasCompletedOnboarding;

    let targetRoute: string | null = null;

    if (!user) {
      if (!isPublicRoute) {
        targetRoute = '/login';
      }
    } else {
      if (!hasCompletedOnboarding) {
        if (!isWelcomeRoute) {
          targetRoute = welcomeRoute;
        }
      } else {
        if (isPublicRoute || isWelcomeRoute) {
          targetRoute = '/';
        }
      }
    }

    if (targetRoute && pathname !== targetRoute) {
      router.push(targetRoute);
    }
  }, [user, userData, isLoading, pathname, router, userDocRef]);


  // While loading, or if redirection is pending, show the loader.
  if (isLoading) {
    return <Loader />;
  }

  const isPublicRoute = publicRoutes.includes(pathname);
  const isWelcomeRoute = pathname === welcomeRoute;
  const hasCompletedOnboarding = userData?.hasCompletedOnboarding;

  if (!user && !isPublicRoute) {
    return <Loader />;
  }
  
  if (user && !hasCompletedOnboarding && !isWelcomeRoute) {
    return <Loader />;
  }

  if (user && hasCompletedOnboarding && (isPublicRoute || isWelcomeRoute)) {
    return <Loader />;
  }


  return <>{children}</>;
}
