'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { HistoryStats } from '@/components/history-stats';
import { EditProfileForm } from '@/components/edit-profile-form';
import { Button } from '@/components/ui/button';
import { useAuth, useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { signOut, updateProfile as updateAuthProfile } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Challenge } from '@/lib/data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

type AppUser = {
  name: string;
  avatar: string;
  points: number;
  dailyStreak: number;
  weeklyStreak: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user: firebaseUser, loading: authLoading } = useUser();
  const { toast } = useToast();

  const userDocRef = firebaseUser ? doc(firestore, 'users', firebaseUser.uid) : null;
  const { data: userProfile, loading: userLoading } = useDoc<AppUser>(userDocRef);

  const challengesQuery = useMemo(() => {
    if (!firebaseUser) return null;
    return collection(firestore, `users/${firebaseUser.uid}/challenges`);
  }, [firebaseUser, firestore]);
  const { data: challenges, loading: challengesLoading } = useCollection<Challenge>(challengesQuery);

  const [shareActivity, setShareActivity] = useState(false);

  const completedChallengesCount = useMemo(() => challenges?.filter((c) => c.isCompleted).length ?? 0, [challenges]);
  const totalChallenges = challenges?.length ?? 0;
  const completionRate =
    totalChallenges > 0
      ? Math.round((completedChallengesCount / totalChallenges) * 100)
      : 0;

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

  if (authLoading) {
    return (
      <div className="flex flex-col h-full">
        <AppHeader title="Perfil" />
        <main className="flex-1 p-4 md:p-6 space-y-6">
           <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Skeleton className="w-24 h-24 rounded-full mb-4" />
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="text-center">
               <Skeleton className="h-10 w-32 mx-auto" />
            </CardContent>
          </Card>
           <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader>
                <CardContent><Skeleton className="h-8 w-1/2" /></CardContent>
              </Card>
              <Card>
                <CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader>
                <CardContent><Skeleton className="h-8 w-1/2" /></CardContent>
              </Card>
              <Card>
                <CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader>
                <CardContent><Skeleton className="h-8 w-1/2" /></CardContent>
              </Card>
            </div>
        </main>
      </div>
    );
  }

  if (!firebaseUser) {
     return (
        <div className="flex h-full items-center justify-center">
            <p>Por favor, inicia sesión para ver tu perfil.</p>
        </div>
    );
  }
  
  const displayName = userProfile?.name || firebaseUser.displayName || 'Usuario';
  const displayAvatar = userProfile?.avatar || firebaseUser.photoURL || '';

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Perfil" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
              {displayAvatar && <AvatarImage src={displayAvatar} />}
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">{displayName}</CardTitle>
            <p className="text-muted-foreground">
              {userLoading ? 'Cargando perfil...' : !userProfile ? 'Finaliza tu registro para ver más.' : 'Te uniste en 2024'}
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <EditProfileForm
              user={{ name: displayName, avatar: displayAvatar }}
              onSave={handleSave}
            >
              <Button>Editar Perfil</Button>
            </EditProfileForm>
          </CardContent>
        </Card>

        {userProfile && (
            <>
                <HistoryStats
                completedCount={completedChallengesCount}
                totalCount={totalChallenges}
                completionRate={completionRate}
                />

                <Card>
                <CardHeader>
                    <CardTitle>Configuración</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                    <Label htmlFor="share-activity" className="flex flex-col gap-1">
                        <span>Compartir actividad</span>
                        <span className="font-normal text-sm text-muted-foreground">
                        Permite que tus amigos vean tus logros y rachas.
                        </span>
                    </Label>
                    <Switch
                        id="share-activity"
                        checked={shareActivity}
                        onCheckedChange={setShareActivity}
                    />
                    </div>
                </CardContent>
                </Card>
            </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="w-full"
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
