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

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();
  
  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userData, loading: userLoading } = useDoc<AppUser>(userDocRef);

  const [isVerified, setIsVerified] = useState(false);
  const isLoading = authLoading || (user && userLoading);

  useEffect(() => {
    if (isLoading) {
      // Still waiting for user data or auth state
      return;
    }

    const isPublic = publicRoutes.includes(pathname);
    const isOnboarding = pathname === onboardingRoute;
    const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;

    // Determine the redirect path, if any
    let redirectPath: string | null = null;

    if (!user && !isPublic) {
      redirectPath = '/login';
    } else if (user) {
      if (isPublic) {
        redirectPath = '/';
      } else if (!hasCompletedOnboarding && !isOnboarding) {
        redirectPath = onboardingRoute;
      } else if (hasCompletedOnboarding && isOnboarding) {
        redirectPath = '/';
      }
    }
    
    if (redirectPath) {
      router.push(redirectPath);
    } else {
      // If no redirection is needed, we can show the content
      setIsVerified(true);
    }
  }, [isLoading, user, userData, pathname, router]);

  if (isLoading || !isVerified) {
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
