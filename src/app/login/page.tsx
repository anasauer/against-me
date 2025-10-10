'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useAuth, useUser } from '@/firebase';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, loading } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);

  useEffect(() => {
    // If user is already logged in, redirect to the main page.
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    // Determine the domain to show for the unauthorized domain error.
    if (typeof window !== 'undefined') {
       // For environments like Firebase Studio, the origin is the correct URL to authorize.
       setUnauthorizedDomain(window.location.origin);
    }
  }, []);

  const handleAuthError = (error: any) => {
     console.error(error);
     setIsSubmitting(false);

    if (error.code === 'auth/unauthorized-domain') {
       setAuthError('unauthorized-domain');
       return;
    }

    let description = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
      if (error.code === 'auth/invalid-credential') {
        description = 'El correo o la contraseña son incorrectos. Por favor, verifica tus credenciales.';
        setAuthError(description); // Set state to show error in form
        return; // Don't show toast for this specific error
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        description = 'Ya existe una cuenta con este correo electrónico. Intenta iniciar sesión con otro método.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        description = 'La ventana de inicio de sesión fue cerrada. Por favor, inténtalo de nuevo.';
      }

      toast({
        title: 'Error al iniciar sesión',
        description: description,
        variant: 'destructive',
      });
  }


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: '¡Bienvenido de nuevo!' });
      // The redirect will be handled by the useEffect hook.
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: '¡Bienvenido!' });
       // The redirect will be handled by the useEffect hook.
    } catch (error: any)
    {
      handleAuthError(error);
    }
  };

  // While loading or if user is logged in, show a loader
  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Only show the login form if not loading and no user is present
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Logo className="w-24 h-24" />
          </div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa a tu cuenta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authError === 'unauthorized-domain' && unauthorizedDomain && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Dominio no Autorizado</AlertTitle>
              <AlertDescription>
                <p className="mb-2">Para iniciar sesión, necesitas autorizar este dominio en Firebase:</p>
                <code className="font-mono text-sm bg-red-100 dark:bg-red-900/50 p-1 rounded break-all select-all">{unauthorizedDomain}</code>
                <ol className="list-decimal list-inside mt-2 text-xs">
                  <li>Copia el dominio de arriba.</li>
                  <li>Ve a la Consola de Firebase &rarr; Authentication &rarr; Settings.</li>
                  <li>Añádelo a la lista de "Authorized domains".</li>
                </ol>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
               {authError && authError !== 'unauthorized-domain' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error de inicio de sesión</AlertTitle>
                  <AlertDescription>
                    {authError}
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@ejemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Iniciar Sesión
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                type="button"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Iniciar Sesión con Google
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{' '}
            <Link href="/signup" className="underline">
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
