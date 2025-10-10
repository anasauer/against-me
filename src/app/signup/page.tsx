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
import { useAuth, useUser, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, loading } = useUser();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPasswordValid = useMemo(() => password.length >= 6, [password]);
  const canSubmit = name && email && isPasswordValid && !isSubmitting;

  useEffect(() => {
    // If user is already logged in, redirect to the main page.
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore || !canSubmit) return;
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;

      // 1. Update Firebase Auth Profile
      await updateProfile(newUser, {
        displayName: name,
      });

      // 2. Create user document in Firestore
      const userDocRef = doc(firestore, 'users', newUser.uid);
      const userData = {
        name: name,
        avatar: newUser.photoURL || '',
        points: 0,
        dailyStreak: 0,
        weeklyStreak: 0,
        friends: [],
        hasCompletedOnboarding: false,
      };

      await setDoc(userDocRef, userData);

      toast({ title: '¡Cuenta creada con éxito!' });
      // After signup, user state will change, and AuthGuard will redirect to /welcome
      // No need to push router here, as the user is not yet considered fully "onboarded"
      // The AuthGuard will see `hasCompletedOnboarding: false` and redirect correctly.

    } catch (error: any) {
      console.error(error);
      // Check if the error is a Firestore permission error
      if (error instanceof FirestorePermissionError) {
         errorEmitter.emit('permission-error', error);
      } else {
        let description = 'Por favor, inténtalo de nuevo.';
        if (error.code === 'auth/email-already-in-use') {
          description =
            'Este correo electrónico ya está en uso. Intenta iniciar sesión.';
        } else if (error.code === 'auth/weak-password') {
          description = 'La contraseña debe tener al menos 6 caracteres.';
        }
        toast({
          title: 'Error al registrarse',
          description,
          variant: 'destructive',
        });
      }
      setIsSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Logo className="w-24 h-24" />
          </div>
          <CardTitle className="text-2xl">Registrarse</CardTitle>
          <CardDescription>
            Crea una cuenta para empezar a gamificar tu vida.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Nombre</Label>
                <Input
                  id="first-name"
                  placeholder="Max"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
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
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                 {password.length > 0 && !isPasswordValid && (
                  <p className="text-xs text-destructive">
                    La contraseña debe tener al menos 6 caracteres.
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={!canSubmit}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Crear una cuenta
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="underline">
              Iniciar Sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
