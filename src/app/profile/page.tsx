'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { HistoryStats } from '@/components/history-stats';
import { challenges } from '@/lib/data';
import { EditProfileForm } from '@/components/edit-profile-form';
import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import type { User as FirebaseUser } from 'firebase/auth';

// This is a temporary type to merge Firebase user with our mock data structure
type AppUser = {
  name: string;
  avatar: string;
  shareActivity: boolean;
};

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const { user: firebaseUser } = useUser();
  const { toast } = useToast();

  // We'll merge firebaseUser with mock data for now
  // TODO: This should all come from a 'users' collection in Firestore
  const [user, setUserState] = useState<AppUser | null>(
    firebaseUser
      ? {
          name: firebaseUser.displayName || 'Usuario',
          avatar: firebaseUser.photoURL || '',
          shareActivity: true, // mock
        }
      : null
  );

  const [shareActivity, setShareActivity] = useState(user?.shareActivity);

  const completedChallenges = challenges.filter((c) => c.isCompleted);
  const totalChallenges = challenges.length;
  const completionRate =
    totalChallenges > 0
      ? Math.round((completedChallenges.length / totalChallenges) * 100)
      : 0;

  const handleSave = (data: { name: string; avatar: string }) => {
    // TODO: This should update the user profile in Firebase Auth and Firestore
    if (user) {
      const updatedUser = { ...user, name: data.name, avatar: data.avatar };
      setUserState(updatedUser);
      toast({
        title: '¡Perfil Actualizado!',
        description: 'Tu nombre y foto de perfil han sido guardados.',
      });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast({ title: 'Has cerrado sesión.' });
    router.push('/login');
  };

  if (!user || !firebaseUser) {
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
