'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EditProfileForm } from '@/components/edit-profile-form';
import { Button } from '@/components/ui/button';
import { useAuth, useUser, useFirestore, useDoc } from '@/firebase';
import { signOut, updateProfile as updateAuthProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Loader2 } from 'lucide-react';

type AppUser = {
  name: string;
  avatar: string;
};

function SettingsPageContent() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user: firebaseUser, loading: authLoading } = useUser();
  const { toast } = useToast();

  const userDocRef = firebaseUser ? doc(firestore, 'users', firebaseUser.uid) : null;
  const { data: userProfile, loading: userLoading } = useDoc<AppUser>(userDocRef);

  const handleSave = (data: { name: string; avatar: string }) => {
    if (!firebaseUser || !userDocRef) return;
    
    updateAuthProfile(firebaseUser, {
      displayName: data.name,
      photoURL: data.avatar,
    }).catch(console.error);

    setDoc(userDocRef, { name: data.name, avatar: data.avatar }, { merge: true })
      .then(() => {
        toast({
          title: '¡Perfil Actualizado!',
          description: 'Tu nombre y foto de perfil han sido guardados.',
        });
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({ title: 'Has cerrado sesión.' });
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
      toast({
        title: 'Error',
        description: 'No se pudo cerrar la sesión. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || userLoading) {
    return (
      <div className="flex flex-col h-full">
        <AppHeader title="Configuración" />
        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                 <Loader2 className="w-20 h-20 animate-spin" />
                <div className='flex-1'>
                    <h3 className="text-xl font-semibold">Cargando...</h3>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!firebaseUser) {
     return (
        <div className="flex h-full items-center justify-center">
            <p>Por favor, inicia sesión para ver tu configuración.</p>
        </div>
    );
  }
  
  const displayName = userProfile?.name || firebaseUser.displayName || 'Usuario';
  const displayAvatar = userProfile?.avatar || firebaseUser.photoURL || '';

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Configuración" />
      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        
        <Card>
            <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>Así es como te verán los demás en la aplicación.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                    <AvatarImage src={displayAvatar} />
                    <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                    <h3 className="text-xl font-semibold">{displayName}</h3>
                    <p className="text-muted-foreground">{firebaseUser.email}</p>
                </div>
                 <EditProfileForm
                    user={{ name: displayName, avatar: displayAvatar }}
                    onSave={handleSave}
                    >
                    <Button variant="outline">Editar Perfil</Button>
                </EditProfileForm>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


export default function SettingsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Render a loader or skeleton on the server and initial client render
  // This prevents hydration mismatches.
  if (!isClient) {
    return (
       <div className="flex flex-col h-full">
        <AppHeader title="Configuración" />
        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
          <Loader2 className="w-8 h-8 animate-spin" />
        </main>
      </div>
    );
  }

  // Once mounted on the client, render the full page content
  return <SettingsPageContent />;
}
