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

const publicRoutes = ['/login', '/signup'];
const onboardingRoute = '/welcome';

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
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();

  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userData, loading: userLoading } = useDoc<AppUser>(userDocRef);
  
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const isLoading = authLoading || (user && userLoading);
    if (isLoading) {
      return; // Espera a que todo esté cargado
    }

    const isPublic = publicRoutes.includes(pathname);
    const isOnboarding = pathname === onboardingRoute;

    let targetRoute: string | null = null;

    if (user) {
      const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;
      if (hasCompletedOnboarding) {
        // Usuario logueado y con onboarding completo
        if (isPublic || isOnboarding) {
          targetRoute = '/';
        }
      } else {
        // Usuario logueado pero sin onboarding completo
        if (!isOnboarding) {
          targetRoute = onboardingRoute;
        }
      }
    } else {
      // Usuario no logueado
      if (!isPublic) {
        targetRoute = '/login';
      }
    }

    if (targetRoute && pathname !== targetRoute) {
      router.push(targetRoute);
    } else {
      setIsVerified(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, userLoading, userData, pathname]);

  if (!isVerified) {
    return <Loader />;
  }

  return <>{children}</>;
}
