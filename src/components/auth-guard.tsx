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
      return; // No hacer nada hasta que todo esté cargado
    }

    const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;
    const isPublic = publicRoutes.includes(pathname);
    const isOnboarding = pathname === onboardingRoute;
    let targetPath: string | null = null;

    if (user) {
      // Usuario autenticado
      if (hasCompletedOnboarding) {
        if (isPublic || isOnboarding) {
          targetPath = '/'; // Ya completó onboarding, debe ir al panel
        }
      } else {
        if (!isOnboarding) {
          targetPath = onboardingRoute; // No ha completado onboarding, debe ir a welcome
        }
      }
    } else {
      // No hay usuario
      if (!isPublic) {
        targetPath = '/login'; // Debe ir a login si intenta acceder a una ruta privada
      }
    }

    if (targetPath && targetPath !== pathname) {
      router.push(targetPath);
    }
  }, [isLoading, user, userData, pathname, router]);

  // Determinar si mostrar el cargador o el contenido
  // Muestra el cargador si:
  // 1. Aún estamos cargando datos.
  // 2. No hay usuario y estamos en una ruta privada (esperando redirección).
  // 3. Hay usuario pero no ha completado el onboarding y no está en la página de welcome (esperando redirección).
  // 4. Hay usuario, completó el onboarding pero está en una página pública (esperando redirección a '/').
  const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;
  if (isLoading || 
      (!user && !publicRoutes.includes(pathname)) ||
      (user && !hasCompletedOnboarding && pathname !== onboardingRoute) ||
      (user && hasCompletedOnboarding && (publicRoutes.includes(pathname) || pathname === onboardingRoute))
     ) {
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

  // Si no hay que redirigir y no está cargando, mostrar el contenido
  return <>{children}</>;
}
