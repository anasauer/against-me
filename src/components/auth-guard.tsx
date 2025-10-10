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
    // Don't run any logic until all loading is complete
    if (isLoading) {
      return;
    }

    const isPublicRoute = publicRoutes.includes(pathname);
    const isWelcomeRoute = pathname === welcomeRoute;

    // If user is not logged in, redirect to login page if not on a public route
    if (!user) {
      if (!isPublicRoute) {
        router.push('/login');
      }
      return;
    }
    
    // At this point, user is logged in.

    // If user document doesn't exist in Firestore yet (e.g., first social login)
    // Create the document and let the hook refetch. The next effect run will handle redirection.
    if (userData === null) {
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
      return; // Wait for useDoc to update with the new data
    }
    
    // User exists, now check onboarding status
    const hasCompletedOnboarding = userData?.hasCompletedOnboarding ?? false;

    // If onboarding is not complete, redirect to welcome page
    if (!hasCompletedOnboarding) {
      if (!isWelcomeRoute) {
        router.push(welcomeRoute);
      }
      return;
    }

    // If onboarding is complete, redirect from public/welcome routes to home
    if (isPublicRoute || isWelcomeRoute) {
      router.push('/');
    }

  }, [user, userData, isLoading, pathname, router, userDocRef]);


  // Render a loader while determining the correct route to prevent content flashing
  if (isLoading) {
    return <Loader />;
  }
  
  const isPublicRoute = publicRoutes.includes(pathname);
  const isWelcomeRoute = pathname === welcomeRoute;
  const hasCompletedOnboarding = userData?.hasCompletedOnboarding;
  
  // Render a loader if a redirect is imminent to prevent flashing wrong content
  if (!user && !isPublicRoute) {
     return <Loader />;
  }
  if (user && hasCompletedOnboarding === false && !isWelcomeRoute) {
     return <Loader />;
  }
   if (user && hasCompletedOnboarding === true && (isPublicRoute || isWelcomeRoute)) {
     return <Loader />;
  }

  // If everything is settled, render the children
  return <>{children}</>;
}
