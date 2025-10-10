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
  const isPublic = publicRoutes.includes(pathname);
  const isOnboarding = pathname === onboardingRoute;

  useEffect(() => {
    if (isLoading) {
      return; // No hacer nada hasta que todo esté cargado
    }

    const hasCompletedOnboarding = userData?.hasCompletedOnboarding === true;
    let redirectPath: string | null = null;

    if (!user && !isPublic) {
      // Si no hay usuario y no es una página pública, redirigir al login
      redirectPath = '/login';
    } else if (user) {
      if (isPublic) {
        // Si hay usuario y está en una página pública, redirigir al panel
        redirectPath = '/';
      } else if (!hasCompletedOnboarding && !isOnboarding) {
        // Si hay usuario, no ha completado el onboarding y no está en la página de onboarding, redirigir a welcome
        redirectPath = onboardingRoute;
      } else if (hasCompletedOnboarding && isOnboarding) {
        // Si hay usuario, ya completó el onboarding y está en la página de welcome, redirigir al panel
        redirectPath = '/';
      }
    }
    
    // Solo redirigir si es necesario y la ruta actual no es ya la de destino
    if (redirectPath && redirectPath !== pathname) {
      router.push(redirectPath);
    }
  }, [isLoading, user, userData, pathname, isPublic, isOnboarding, router]);


  // Mostrar el cargador mientras se determina el estado, o si una redirección está en curso.
  if (isLoading || (!user && !isPublic) || (user && !userData?.hasCompletedOnboarding && !isOnboarding)) {
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

  // Si todas las condiciones se cumplen, mostrar el contenido
  return <>{children}</>;
}
