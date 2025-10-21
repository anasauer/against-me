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
    // 1. Wait until all loading is finished before making any decisions.
    if (isLoading) {
      return;
    }

    const isPublic = publicRoutes.includes(pathname);
    const isWelcome = pathname === welcomeRoute;

    // 2. If the user is not logged in
    if (!user) {
      if (!isPublic) {
        router.push('/login');
      }
      return;
    }

    // From this point, we know the user is logged in.

    // 3. Handle first-time social login (user doc doesn't exist)
    if (userData === null && userDocRef) {
      const newUserProfile: UserProfile = {
        name: user.displayName || 'Nuevo Usuario',
        email: user.email?.toLowerCase() || '',
        avatar: user.photoURL || '',
        points: 0,
        dailyStreak: 0,
        weeklyStreak: 0,
        friends: [],
        hasCompletedOnboarding: true, // Bypass welcome screen
      };

      setDoc(userDocRef, newUserProfile).catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'create',
          requestResourceData: newUserProfile,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
      // After creating the profile, the useDoc hook will re-run.
      // The component will re-render, and the logic will proceed to the next step.
      // We return here to wait for the re-render.
      return;
    }

    const hasCompletedOnboarding = userData?.hasCompletedOnboarding;

    // 4. If user is logged in but hasn't completed onboarding (LOGIC DEACTIVATED)
    // if (!hasCompletedOnboarding) {
    //   if (!isWelcome) {
    //     router.push(welcomeRoute);
    //   }
    //   return;
    // }

    // 5. If user is logged in and onboarding is complete (or bypassed)
    if (isPublic || isWelcome) {
      router.push('/');
    }
  }, [user, userData, isLoading, pathname, router, userDocRef]);
  
  const isPublic = publicRoutes.includes(pathname);
  const isWelcome = pathname === welcomeRoute;

  // Show a loader while any data is loading to prevent content flashing
  if (isLoading) {
    return <Loader />;
  }
  
  // Show loader during redirection to prevent flashing incorrect UI
  if (!user && !isPublic) {
    return <Loader />;
  }
  
  // This logic is deactivated, but we keep the loader for consistency
  // if (user && !userData?.hasCompletedOnboarding && !isWelcome) {
  //   return <Loader />;
  // }

  if (user && userData?.hasCompletedOnboarding && (isPublic || isWelcome)) {
    return <Loader />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
}
