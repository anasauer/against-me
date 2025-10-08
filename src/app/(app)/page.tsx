'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { AppHeader } from '@/components/layout/header';
import { StreakCounter } from '@/components/streak-counter';
import { ChallengeList } from '@/components/challenge-list';
import { SocialFeed } from '@/components/social-feed';
import {
  activities,
  receivedChallenges as initialReceivedChallenges,
} from '@/lib/data';
import type { Challenge, ReceivedChallenge } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { ReceivedChallengeCard } from '@/components/received-challenge-card';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, addDoc } from 'firebase/firestore';

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


  const handleAcceptChallenge = async (challenge: ReceivedChallenge) => {
    if (!user) return;
    
    // Remove from received and add to main challenge list
    setReceivedChallenges((prev) => prev.filter((c) => c.id !== challenge.id));

    const newChallenge: Omit<Challenge, 'id'> = {
      title: challenge.title,
      description: `Reto de ${challenge.from.name}. Recompensa: ${challenge.reward}`,
      points: 150, // Assign some points, this could be dynamic later
      type: 'special',
      isCompleted: false,
      userId: user.uid,
    };

    try {
      if (!challengesQuery) throw new Error("Not authenticated");
      const docRef = await addDoc(challengesQuery, newChallenge);
      // Optimistically update UI
      setChallenges((prev) => [...prev, { ...newChallenge, id: docRef.id }]);
      toast({
        title: '¡Reto Aceptado!',
        description: `"${challenge.title}" ha sido añadido a tu lista.`,
      });
    } catch (error) {
      console.error("Error accepting challenge: ", error);
      // Rollback UI update if needed
      setReceivedChallenges(initialReceivedChallenges); // a simple rollback
      toast({
        title: 'Error',
        description: 'No se pudo aceptar el reto.',
        variant: 'destructive',
      });
    }
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
            <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold">¡Reclama Tus Recompensas!</h3>
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
            </div>
            <SocialFeed activities={activities.slice(0, 2)} />
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
