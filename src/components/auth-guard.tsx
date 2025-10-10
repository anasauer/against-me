'use client';

import { useUser, useFirestore, useDoc } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
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

  const isLoading = authLoading || (user && userLoading);

  useEffect(() => {
    if (isLoading) {
      return; // No hagas nada mientras se carga.
    }

    const isPublic = publicRoutes.includes(pathname);
    const isOnboarding = pathname === onboardingRoute;

    // Lógica de redirección después de que el estado se haya estabilizado.
    if (user) {
      const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;

      if (!hasCompletedOnboarding && !isOnboarding) {
        router.push(onboardingRoute);
      } else if (hasCompletedOnboarding && (isPublic || isOnboarding)) {
        router.push('/');
      }
    } else {
      if (!isPublic) {
        router.push('/login');
      }
    }
  }, [isLoading, user, userData, pathname, router]);

  // Renderiza un cargador global mientras se resuelve la autenticación y la redirección
  if (isLoading) {
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

  // Lógica para evitar un parpadeo de contenido incorrecto mientras se redirige
  const isPublic = publicRoutes.includes(pathname);
  const isOnboarding = pathname === onboardingRoute;
  let shouldRenderChildren = true;

  if (user) {
     const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;
      if (!hasCompletedOnboarding && !isOnboarding) {
        shouldRenderChildren = false;
      } else if (hasCompletedOnboarding && (isPublic || isOnboarding)) {
        shouldRenderChildren = false;
      }
  } else {
    if (!isPublic) {
      shouldRenderChildren = false;
    }
  }

  if (!shouldRenderChildren) {
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
