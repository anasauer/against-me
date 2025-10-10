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

  const isLoading = authLoading || (user && userLoading);

  useEffect(() => {
    // Solo ejecutar la lógica cuando la carga haya terminado.
    if (isLoading) {
      return;
    }

    const isPublic = publicRoutes.includes(pathname);
    const isOnboarding = pathname === onboardingRoute;

    if (user) {
      // Usuario autenticado
      const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;

      if (hasCompletedOnboarding) {
        if (isPublic || isOnboarding) {
          router.push('/');
        }
      } else {
        if (!isOnboarding) {
          router.push(onboardingRoute);
        }
      }
    } else {
      // No hay usuario
      if (!isPublic) {
        router.push('/login');
      }
    }
  }, [isLoading, user, userData, pathname, router]);

  // Mostrar el cargador mientras se determina el estado.
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

  // Lógica para determinar si mostrar el contenido o el cargador durante la redirección
  const isPublic = publicRoutes.includes(pathname);
  const isOnboarding = pathname === onboardingRoute;
  if (user) {
    const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;
    if (hasCompletedOnboarding && (isPublic || isOnboarding)) {
       // Estamos a punto de redirigir a '/', mostramos el loader
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
    if (!hasCompletedOnboarding && !isOnboarding) {
      // Estamos a punto de redirigir a '/welcome', mostramos el loader
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
  } else if (!isPublic) {
    // Estamos a punto de redirigir a '/login', mostramos el loader
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

  // Si no hay redirección pendiente, mostrar el contenido
  return <>{children}</>;
}
