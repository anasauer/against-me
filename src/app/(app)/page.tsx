'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { AppHeader } from '@/components/layout/header';
import { StreakCounter } from '@/components/streak-counter';
import { ChallengeList } from '@/components/challenge-list';
import {
  receivedChallenges as initialReceivedChallenges,
} from '@/lib/data';
import type { Challenge, ReceivedChallenge } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { ReceivedChallengeCard } from '@/components/received-challenge-card';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function HomePageContent() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  // Fetch challenges from Firestore
  const challengesQuery = useMemo(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/challenges`);
  }, [user, firestore]);
  const { data: challengesData, loading: challengesLoading } = useCollection<Challenge>(challengesQuery);

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [receivedChallenges, setReceivedChallenges] = useState<ReceivedChallenge[]>(initialReceivedChallenges);

  useEffect(() => {
    if (challengesData) {
      // Assuming challengesData from Firestore doesn't have an `id` field in the document data.
      // The document ID should be used as the challenge ID.
      // This part might need adjustment based on how useCollection is implemented to return doc IDs.
      // For now, let's assume the data is correctly formatted.
      setChallenges(challengesData);
    }
  }, [challengesData]);


  const handleAcceptChallenge = (challenge: ReceivedChallenge) => {
    if (!user || !challengesQuery) return;
    
    // Remove from received and add to main challenge list
    setReceivedChallenges((prev) => prev.filter((c) => c.id !== challenge.id));

    const newChallenge = {
      title: challenge.title,
      description: `Reto de ${challenge.from.name}. Recompensa: ${challenge.reward}`,
      points: 10, // Assign some points, this could be dynamic later
      type: 'special' as const,
      isCompleted: false,
      userId: user.uid,
    };

    addDoc(challengesQuery, newChallenge)
      .then((docRef) => {
        setChallenges((prev) => [...prev, { ...newChallenge, id: docRef.id }]);
        toast({
          title: '¡Reto Aceptado!',
          description: `"${challenge.title}" ha sido añadido a tu lista.`,
        });
      })
      .catch((error) => {
        // Rollback UI update if needed
        setReceivedChallenges(initialReceivedChallenges); // a simple rollback
        const permissionError = new FirestorePermissionError({
          path: challengesQuery.path,
          operation: 'create',
          requestResourceData: newChallenge
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleDeclineChallenge = (challengeId: string) => {
    setReceivedChallenges((prev) => prev.filter((c) => c.id !== challengeId));
    toast({
      title: 'Reto Rechazado',
      variant: 'destructive',
    });
  };

  const todaysChallenges = challenges
    .filter(
      (c) =>
        c.isCompleted === false && (c.type === 'daily' || c.type === 'special')
    )
    .slice(0, 3);

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Panel" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <StreakCounter />

        {receivedChallenges.length > 0 && (
          <ReceivedChallengeCard
            challenge={receivedChallenges[0]}
            onAccept={handleAcceptChallenge}
            onDecline={handleDeclineChallenge}
          />
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ChallengeList
              title="Retos de Hoy"
              challenges={todaysChallenges}
              loading={challengesLoading}
            />
          </div>
          <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-xl">¡Reclama Tus Recompensas!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mt-2 mb-4 text-primary-foreground/80">
                  Tienes puntos para gastar. Echa un vistazo a las recompensas que
                  has establecido para ti.
                </p>
                <Link href="/rewards">
                  <Button variant="secondary" className="w-full">
                    <Gift className="mr-2 h-4 w-4" />
                    Ir a Recompensas
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}


export default function HomePage() {
  return (
      <HomePageContent />
  );
}
