'use client';

import { AppHeader } from '@/components/layout/header';
import { ChallengeList } from '@/components/challenge-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import type { Challenge } from '@/lib/data';
import { CreateChallengeForm } from '@/components/create-challenge-form';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function ChallengesPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const challengesQuery = useMemo(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/challenges`);
  }, [user, firestore]);
  
  const { data: challengesData, loading } = useCollection<Challenge & { id: string }>(challengesQuery);

  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    if (challengesData) {
      setChallenges(challengesData);
    }
  }, [challengesData]);

  const daily = challenges.filter((c) => c.type === 'daily');
  const weekly = challenges.filter((c) => c.type === 'weekly');
  const special = challenges.filter((c) => c.type === 'special');

  const handleChallengeCreated = (
    newChallenge: Omit<Challenge, 'id' | 'isCompleted' | 'userId'>
  ) => {
    if (!user || !challengesQuery) return;
    
    const challengeToAdd = {
      ...newChallenge,
      isCompleted: false,
      userId: user.uid,
    };
    
    addDoc(challengesQuery, challengeToAdd)
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: challengesQuery.path,
          operation: 'create',
          requestResourceData: challengeToAdd,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Retos" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold font-headline">
            Gestiona Tus Misiones
          </h2>
          <CreateChallengeForm onChallengeCreated={handleChallengeCreated}>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear Reto
            </Button>
          </CreateChallengeForm>
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="daily">Diarios</TabsTrigger>
            <TabsTrigger value="weekly">Semanales</TabsTrigger>
            <TabsTrigger value="special">Especiales</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <ChallengeList
              title="Todos los Retos"
              challenges={challenges}
              loading={loading}
              showAddButton={false}
            />
          </TabsContent>
          <TabsContent value="daily" className="mt-4">
            <ChallengeList
              title="Retos Diarios"
              challenges={daily}
              loading={loading}
              showAddButton={false}
            />
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
            <ChallengeList
              title="Retos Semanales"
              challenges={weekly}
              loading={loading}
              showAddButton={false}
            />
          </TabsContent>
          <TabsContent value="special" className="mt-4">
            <ChallengeList
              title="Retos Especiales"
              challenges={special}
              loading={loading}
              showAddButton={false}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
