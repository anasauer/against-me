
'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/layout/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { user as initialUser, setUser } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { HistoryStats } from '@/components/history-stats';
import { challenges } from '@/lib/data';
import { EditProfileForm } from '@/components/edit-profile-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [user, setUserState] = useState(initialUser);
  const [shareActivity, setShareActivity] = useState(user.shareActivity);
  const userAvatar = getPlaceholderImage('user-avatar-main');

  const completedChallenges = challenges.filter((c) => c.isCompleted);
  const totalChallenges = challenges.length;
  const completionRate =
    totalChallenges > 0
      ? Math.round((completedChallenges.length / totalChallenges) * 100)
      : 0;
  
  const handleSave = (data: { name: string; avatar: string }) => {
    const updatedUser = { ...user, name: data.name };
    setUser(updatedUser); // Update mock data source
    setUserState(updatedUser); // Update local state
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Perfil" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
              {userAvatar && (
                <AvatarImage
                  src={userAvatar.imageUrl}
                  data-ai-hint={userAvatar.imageHint}
                />
              )}
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">{user.name}</CardTitle>
            <p className="text-muted-foreground">Te uniste en 2024</p>
          </CardHeader>
          <CardContent className="text-center">
            <EditProfileForm user={user} onSave={handleSave} />
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
            <Link href="/login" className="w-full">
               <Button variant="destructive" className="w-full">Cerrar sesión</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
