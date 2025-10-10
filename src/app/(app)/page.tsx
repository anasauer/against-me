'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { AppHeader } from '@/components/layout/header';
import { StreakCounter } from '@/components/streak-counter';
import { ChallengeList } from '@/components/challenge-list';
import type { ReceivedChallenge } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Gift, ShieldCheck } from 'lucide-react';
import { ReceivedChallengeCard } from '@/components/received-challenge-card';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, addDoc, doc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { UserProfile, Challenge } from '@/lib/types';

const welcomeChallenge: ReceivedChallenge = {
  id: 'rc1',
  title: '¡Completa tu primer reto!',
  from: {
    name: 'AgainstMe',
    avatar: '', // Force fallback
    avatarHint: 'app logo',
  },
  reward: '10 puntos de bonificación',
};

function HomePageContent() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemo(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
  const { data: userProfile, loading: userProfileLoading } = useDoc<UserProfile>(userDocRef);

  // Fetch challenges from Firestore
  const challengesQuery = useMemo(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/challenges`);
  }, [user, firestore]);
  const { data: challengesData, loading: challengesLoading } =
    useCollection<Challenge>(challengesQuery);

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [receivedChallenges, setReceivedChallenges] = useState<ReceivedChallenge[]>([]);
  const [shareActivity, setShareActivity] = useState(false);

  useEffect(() => {
    if (challengesData) {
      setChallenges(challengesData);
    }
  }, [challengesData]);

  useEffect(() => {
    // Show welcome challenge only if onboarding is not complete
    if (userProfile && userProfile.hasCompletedOnboarding === false) {
      setReceivedChallenges([welcomeChallenge]);
    } else {
      setReceivedChallenges([]);
    }
  }, [userProfile]);

  const handleAcceptChallenge = (challenge: ReceivedChallenge) => {
    if (!user || !challengesQuery) return;

    // Remove from received and add to main challenge list
    setReceivedChallenges((prev) => prev.filter((c) => c.id !== challenge.id));

    const newChallenge = {
      title: challenge.title,
      description: `Reto de ${challenge.from.name}. Recompensa: ${challenge.reward}`,
      points: 10,
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
        if (userProfile && userProfile.hasCompletedOnboarding === false) {
          setReceivedChallenges([welcomeChallenge]);
        }
        const permissionError = new FirestorePermissionError({
          path: challengesQuery.path,
          operation: 'create',
          requestResourceData: newChallenge,
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

        {!userProfileLoading && receivedChallenges.length > 0 && (
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
              onChallengeCreated={() => {}}
            />
          </div>
          <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-xl">
                  ¡Reclama Tus Recompensas!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mt-2 mb-4 text-primary-foreground/80">
                  Tienes puntos para gastar. Echa un vistazo a las recompensas
                  que has establecido para ti.
                </p>
                <Link href="/rewards">
                  <Button variant="secondary" className="w-full">
                    <Gift className="mr-2 h-4 w-4" />
                    Ir a Recompensas
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Configuración de Privacidad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="share-activity" className="flex flex-col gap-1">
                    <span>Compartir actividad</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Permite que tus amigos vean tus logros.
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return <HomePageContent />;
}
