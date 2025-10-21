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
      return; // Wait until all data is loaded
    }

    const isPublicRoute = publicRoutes.includes(pathname);
    const isWelcomeRoute = pathname === welcomeRoute;

    // SCENARIO 1: User is not logged in
    if (!user) {
      if (!isPublicRoute) {
        router.push('/login');
      }
      return;
    }

    // From here, we know the user is logged in.

    // SCENARIO 2: Handle first-time social login (user doc doesn't exist yet)
    // The useDoc hook will return `null` if the document doesn't exist after loading.
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

        // Create the user document
        setDoc(userDocRef, newUserProfile).catch((error) => {
           const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: newUserProfile,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
        
        // After creating the profile, the useDoc hook will re-run and get the new userData.
        // The logic will then fall through to SCENARIO 3.
        return;
    }

    // SCENARIO 3: User is logged in but hasn't completed onboarding
    const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;
    
    if (!hasCompletedOnboarding) {
      if (!isWelcomeRoute) {
        router.push(welcomeRoute); // Force them to the welcome page
      }
      return; // If they are on the welcome page, let them stay.
    }
    
    // SCENARIO 4: User is logged in and has completed onboarding.
    if (isPublicRoute || isWelcomeRoute) {
      router.push('/'); // They should not be on login, signup, or welcome pages.
    }

  }, [user, userData, isLoading, pathname, router, userDocRef]);

  // --- Render Logic ---

  // 1. While loading, always show the loader.
  if (isLoading) {
    return <Loader />;
  }
  
  const isPublicRoute = publicRoutes.includes(pathname);
  const isWelcomeRoute = pathname === welcomeRoute;
  const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;

  // 2. Prevent content flashing during redirects by showing the loader.
  // If the logic in useEffect is about to trigger a redirect, this will show a loader
  // instead of the wrong page content for a split second.
  if (!user && !isPublicRoute) {
    return <Loader />;
  }
  if (user && !hasCompletedOnboarding && !isWelcomeRoute) {
    return <Loader />;
  }
  if (user && hasCompletedOnboarding && (isPublicRoute || isWelcomeRoute)) {
    return <Loader />;
  }

  // 3. If all checks pass, the user is on the correct page.
  return <>{children}</>;
}
