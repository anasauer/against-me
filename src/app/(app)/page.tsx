'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { AppHeader } from '@/components/layout/header';
import { StreakCounter } from '@/components/streak-counter';
import { ChallengeList } from '@/components/challenge-list';
import { Button } from '@/components/ui/button';
import { Gift, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, addDoc, doc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { UserProfile, Challenge } from '@/lib/types';
import type { ReceivedChallenge as ReceivedChallengeType } from '@/lib/data';
import { ReceivedChallengeCard } from '@/components/received-challenge-card';

// This is a flag that persists across re-renders but not page reloads
let hasShownWelcomeChallenge = false;

function HomePageContent() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemo(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
  const { data: userProfile } = useDoc<UserProfile>(userDocRef);

  // Fetch challenges from Firestore
  const challengesQuery = useMemo(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/challenges`);
  }, [user, firestore]);
  const { data: challenges, loading: challengesLoading } =
    useCollection<Challenge>(challengesQuery);
  
  const [shareActivity, setShareActivity] = useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = useState(false);
  
  // Effect to show the welcome card for new users
  useEffect(() => {
    // We check if the user profile is loaded, has *just* completed onboarding,
    // and if we haven't already shown the card in this session.
    if (userProfile && userProfile.hasCompletedOnboarding && !hasShownWelcomeChallenge) {
      setShowWelcomeCard(true);
      hasShownWelcomeChallenge = true; // Mark as shown for this session
    }
  }, [userProfile]);

  const welcomeChallenge: ReceivedChallengeType = {
    id: 'welcome-challenge',
    title: '¡Completa tu primer reto!',
    from: {
      name: 'AgainstMe',
      avatar: '',
      avatarHint: 'app logo',
    },
    reward: '10 puntos',
  };

  const handleAcceptWelcomeChallenge = () => {
    const newChallengeData = {
      title: welcomeChallenge.title,
      description: 'Reto de bienvenida de AgainstMe.',
      points: 10,
      type: 'special' as const,
    };
    handleAddChallenge(newChallengeData);
    setShowWelcomeCard(false);
     toast({
      title: '¡Reto Aceptado!',
      description: 'El reto ha sido añadido a tu lista de "Retos de Hoy".',
    });
  };

  const handleDeclineWelcomeChallenge = () => {
    setShowWelcomeCard(false);
    toast({
      title: 'Reto Rechazado',
      description: 'No te preocupes, ¡hay muchos otros retos por hacer!',
      variant: 'destructive',
    });
  };

  const todaysChallenges = useMemo(() => {
    return (
      challenges
        ?.filter(
          (c) =>
            !c.isCompleted && (c.type === 'daily' || c.type === 'special')
        )
        .slice(0, 3) || []
    );
  }, [challenges]);
  
  const handleAddChallenge = (newChallengeData: Omit<Challenge, 'id'|'isCompleted'|'userId'>) => {
    if (!user || !challengesQuery) return;
    
    const newChallenge = {
      ...newChallengeData,
      isCompleted: false,
      userId: user.uid,
    };
    
    addDoc(challengesQuery, newChallenge)
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: challengesQuery.path,
          operation: 'create',
          requestResourceData: newChallenge,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  }

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Panel" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <StreakCounter />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {showWelcomeCard && (
               <ReceivedChallengeCard
                challenge={welcomeChallenge}
                onAccept={handleAcceptWelcomeChallenge}
                onDecline={handleDeclineWelcomeChallenge}
              />
            )}
            <ChallengeList
              title="Retos de Hoy"
              challenges={todaysChallenges}
              loading={challengesLoading}
              onChallengeCreated={handleAddChallenge}
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
