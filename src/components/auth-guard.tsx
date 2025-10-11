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
  // Pass a key to useDoc to force re-evaluation when the user changes.
  const { data: userData, loading: userLoading } = useDoc<UserProfile>(userDocRef);

  // The final loading state depends on auth and the user document.
  // It's loading if auth is loading, OR if we have a user but their data isn't loaded yet.
  const isLoading = authLoading || (!!user && userLoading);

  useEffect(() => {
    // 1. Wait until all loading is finished before making any decisions.
    if (isLoading) {
      return;
    }

    const isPublicRoute = publicRoutes.includes(pathname);
    const isWelcomeRoute = pathname === welcomeRoute;

    // 2. If the user is not logged in, they must be on a public route.
    if (!user) {
      if (!isPublicRoute) {
        router.push('/login');
      }
      return;
    }

    // From here, we know the user is logged in.

    // 3. Handle first-time login (e.g., social auth) where user doc might not exist.
    if (userData === null && userDocRef) {
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

        setDoc(userDocRef, newUserProfile).catch((error) => {
           const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: newUserProfile,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
        
        // After creating the profile, let the hook re-run to get the new `userData`.
        // The next run will handle the redirect to /welcome.
        return;
    }

    // 4. Handle onboarding flow.
    const hasCompletedOnboarding = userData?.hasCompletedOnboarding;
    
    if (!hasCompletedOnboarding) {
      if (!isWelcomeRoute) {
        router.push(welcomeRoute);
      }
      return; // Stay on the welcome route.
    }
    
    // 5. User is logged in and has completed onboarding.
    // They should not be on a public or welcome route.
    if (isPublicRoute || isWelcomeRoute) {
      router.push('/');
    }

  }, [user, userData, isLoading, pathname, router, userDocRef]);


  // --- Render Logic ---

  // Show a loader while waiting for auth state or user data.
  if (isLoading) {
    return <Loader />;
  }
  
  const isPublicRoute = publicRoutes.includes(pathname);
  const isWelcomeRoute = pathname === welcomeRoute;
  const hasCompletedOnboarding = userData?.hasCompletedOnboarding;

  // Prevent flashing incorrect content during redirects.
  // If a redirect is about to happen, show the loader.
  if (!user && !isPublicRoute) {
    return <Loader />;
  }
  if (user && !hasCompletedOnboarding && !isWelcomeRoute) {
    return <Loader />;
  }
  if (user && hasCompletedOnboarding && (isPublicRoute || isWelcomeRoute)) {
    return <Loader />;
  }

  // If all checks pass, the user is on the correct page.
  return <>{children}</>;
}
