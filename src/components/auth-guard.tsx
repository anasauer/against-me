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
  
  const isLoading = authLoading || (user != null && userLoading);

  useEffect(() => {
    if (isLoading) {
      return; // No hacer nada hasta que todo esté cargado
    }

    const isPublic = publicRoutes.includes(pathname);
    const isOnboarding = pathname === onboardingRoute;
    
    let targetRoute: string | null = null;

    if (!user) {
      // Si no hay usuario, debe estar en una ruta pública
      if (!isPublic) {
        targetRoute = '/login';
      }
    } else {
      // Si hay usuario, comprobar el estado de onboarding
      const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;

      if (hasCompletedOnboarding) {
        // Si ya completó el onboarding, no debe estar en welcome ni en rutas públicas
        if (isOnboarding || isPublic) {
          targetRoute = '/';
        }
      } else {
        // Si no ha completado el onboarding, debe estar en welcome
        if (!isOnboarding) {
          targetRoute = onboardingRoute;
        }
      }
    }

    if (targetRoute && pathname !== targetRoute) {
      router.push(targetRoute);
    } else {
      // Si ya estamos en la ruta correcta, o no se necesita redirección, verificamos y renderizamos
      setIsVerified(true);
    }
  }, [isLoading, user, userData, pathname, router]);

  if (!isVerified) {
    return <Loader />;
  }

  return <>{children}</>;
}
