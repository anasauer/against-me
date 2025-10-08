'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Zap } from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

export function StreakCounter() {
  const { user: firebaseUser } = useUser();
  const firestore = useFirestore();
  const userDocRef = firebaseUser ? doc(firestore, 'users', firebaseUser.uid) : null;
  const { data: userProfile, loading } = useDoc<UserProfile>(userDocRef);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Racha Diaria</CardTitle>
            <Flame className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Racha Semanal</CardTitle>
            <Zap className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const dailyStreak = userProfile?.dailyStreak ?? 0;
  const weeklyStreak = userProfile?.weeklyStreak ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Racha Diaria</CardTitle>
          <Flame className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dailyStreak} días</div>
          <p className="text-xs text-muted-foreground">
            ¡Sigue así para desbloquear bonificaciones!
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Racha Semanal</CardTitle>
          <Zap className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weeklyStreak} semanas</div>
          <p className="text-xs text-muted-foreground">¡Estás en racha!</p>
        </CardContent>
      </Card>
    </div>
  );
}
