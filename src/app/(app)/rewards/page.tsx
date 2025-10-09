'use client';

import { AppHeader } from '@/components/layout/header';
import { RewardList } from '@/components/reward-list';
import { rewards } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle, Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/lib/types';

export default function RewardsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userProfile, loading: userLoading } = useDoc<UserProfile>(userDocRef);

  const points = userProfile?.points ?? 0;

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Recompensas" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Card className="bg-primary/5 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Coins className="w-5 h-5 text-primary" />
              Tus Puntos Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-3xl font-bold text-primary">
                {points.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold font-headline">Canjea Tus Puntos</h2>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Recompensa
          </Button>
        </div>
        <RewardList rewards={rewards} />
      </main>
    </div>
  );
}
