
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AppHeader } from '@/components/layout/header';
import { StreakCounter } from '@/components/streak-counter';
import { ChallengeList } from '@/components/challenge-list';
import { SocialFeed } from '@/components/social-feed';
import {
  challenges as initialChallenges,
  activities,
  receivedChallenges as initialReceivedChallenges,
} from '@/lib/data';
import type { Challenge, ReceivedChallenge } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { ReceivedChallengeCard } from '@/components/received-challenge-card';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [receivedChallenges, setReceivedChallenges] = useState<ReceivedChallenge[]>(
    initialReceivedChallenges
  );
  const { toast } = useToast();

  const handleAcceptChallenge = (challenge: ReceivedChallenge) => {
    // Remove from received and add to main challenge list
    setReceivedChallenges((prev) => prev.filter((c) => c.id !== challenge.id));

    const newChallenge: Challenge = {
      id: `challenge-${Date.now()}`,
      title: challenge.title,
      description: `Reto de ${challenge.from.name}. Recompensa: ${challenge.reward}`,
      points: 150, // Assign some points, this could be dynamic later
      type: 'special',
      isCompleted: false,
    };
    setChallenges((prev) => [newChallenge, ...prev]);

    toast({
      title: '¡Reto Aceptado!',
      description: `"${challenge.title}" ha sido añadido a tu lista.`,
    });
  };

  const handleDeclineChallenge = (challengeId: string) => {
     setReceivedChallenges((prev) => prev.filter((c) => c.id !== challengeId));
     toast({
      title: 'Reto Rechazado',
      variant: 'destructive',
    });
  }

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
            <ChallengeList title="Retos de Hoy" challenges={todaysChallenges} setChallenges={setChallenges} />
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
