'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { HistoryStats } from '@/components/history-stats';
import { challenges as mockChallenges } from '@/lib/data';
import { EditProfileForm } from '@/components/edit-profile-form';
import { Button } from '@/components/ui/button';
import { useAuth, useUser, useFirestore, useDoc } from '@/firebase';
import { signOut, updateProfile as updateAuthProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { User as FirebaseUser } from 'firebase/auth';

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
  const { user: firebaseUser } = useUser();
  const { toast } = useToast();

  const userDocRef = firebaseUser ? doc(firestore, 'users', firebaseUser.uid) : null;
  const { data: user, loading: userLoading } = useDoc<AppUser>(userDocRef);

  const [shareActivity, setShareActivity] = useState(true);

  const completedChallenges = mockChallenges.filter((c) => c.isCompleted);
  const totalChallenges = mockChallenges.length;
  const completionRate =
    totalChallenges > 0
      ? Math.round((completedChallenges.length / totalChallenges) * 100)
      : 0;

  const handleSave = async (data: { name: string; avatar: string }) => {
    if (user && firebaseUser && userDocRef) {
      try {
        // Update Firestore document
        await setDoc(userDocRef, { name: data.name, avatar: data.avatar }, { merge: true });

        // Update Firebase Auth profile
        await updateAuthProfile(firebaseUser, {
          displayName: data.name,
          photoURL: data.avatar,
        });

        toast({
          title: '¡Perfil Actualizado!',
          description: 'Tu nombre y foto de perfil han sido guardados.',
        });
      } catch (error) {
        console.error("Error updating profile: ", error);
        toast({
          variant: 'destructive',
          title: 'Error al actualizar',
          description: 'No se pudo guardar tu perfil. Inténtalo de nuevo.',
        });
      }
    }
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

  if (userLoading || !user || !firebaseUser) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Perfil" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
              {user.avatar && <AvatarImage src={user.avatar} />}
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">{user.name}</CardTitle>
            <p className="text-muted-foreground">Te uniste en 2024</p>
          </CardHeader>
          <CardContent className="text-center">
            <EditProfileForm
              user={{ name: user.name, avatar: user.avatar }}
              onSave={handleSave}
            />
          </CardContent>
        </Card>

        <HistoryStats
          completedCount={completedChallenges.length}
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
