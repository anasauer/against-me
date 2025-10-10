'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, writeBatch, collection } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/logo';
import { Loader2 } from 'lucide-react';
import { challenges as suggestedChallenges } from '@/lib/data';
import type { Challenge } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function WelcomePage() {
  const router = useRouter();
  const { user: firebaseUser, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [selectedChallenges, setSelectedChallenges] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, authLoading, router]);

  const handleToggleChallenge = (challengeId: string) => {
    setSelectedChallenges((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(challengeId)) {
        newSet.delete(challengeId);
      } else {
        newSet.add(challengeId);
      }
      return newSet;
    });
  };

  const handleFinishOnboarding = async () => {
    if (!firebaseUser || !firestore) return;
    setIsSubmitting(true);

    try {
      const batch = writeBatch(firestore);
      const userDocRef = doc(firestore, 'users', firebaseUser.uid);
      const challengesColRef = collection(firestore, `users/${firebaseUser.uid}/challenges`);
      
      const challengesToAdd: Array<Omit<Challenge, 'id'>> = [];

      // 1. Add the welcome challenge from AgainstMe
      const welcomeChallengeRef = doc(challengesColRef);
      const welcomeChallengeData = {
        title: '¡Completa tu primer reto!',
        description: 'Reto de bienvenida de AgainstMe. Recompensa: 10 puntos.',
        points: 10,
        type: 'special' as const,
        isCompleted: false,
        userId: firebaseUser.uid,
      };
      challengesToAdd.push(welcomeChallengeData);
      batch.set(welcomeChallengeRef, welcomeChallengeData);
      
      // 2. Add user-selected challenges
      suggestedChallenges
        .filter((c) => selectedChallenges.has(c.id))
        .forEach((challenge) => {
          const newChallengeRef = doc(challengesColRef);
          const challengeData = {
            title: challenge.title,
            description: challenge.description,
            points: challenge.points,
            type: challenge.type,
            isCompleted: false,
            userId: firebaseUser.uid,
          };
          challengesToAdd.push(challengeData);
          batch.set(newChallengeRef, challengeData);
        });
      
      // 3. Mark onboarding as complete
      batch.set(userDocRef, { hasCompletedOnboarding: true }, { merge: true });

      // Commit all changes at once
      await batch.commit();

      toast({
        title: '¡Todo listo!',
        description: 'Hemos añadido tus primeros retos. ¡A por ellos!',
      });
      router.push('/');

    } catch (error) {
      console.error('Error completing onboarding:', error);
      const permissionError = new FirestorePermissionError({
        path: `users/${firebaseUser.uid}`, // Approximate path for batch write
        operation: 'update',
        requestResourceData: { hasCompletedOnboarding: true, selectedChallenges: Array.from(selectedChallenges) },
      });
      errorEmitter.emit('permission-error', permissionError);
      setIsSubmitting(false);
    }
  };

  if (authLoading || !firebaseUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
            <Logo />
          </div>
          <CardTitle className="text-3xl font-bold">¡Bienvenido a Questify!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Para empezar, elige algunos retos que quieras añadir a tu lista.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Retos Sugeridos</h3>
              <div className="space-y-2 rounded-md border p-4">
                {suggestedChallenges.slice(0, 4).map((challenge) => (
                    <div key={challenge.id} className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50">
                    <Checkbox
                        id={`challenge-${challenge.id}`}
                        checked={selectedChallenges.has(challenge.id)}
                        onCheckedChange={() => handleToggleChallenge(challenge.id)}
                      />
                    <label htmlFor={`challenge-${challenge.id}`} className="flex-1 cursor-pointer">
                        <span className="font-medium">{challenge.title}</span>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </label>
                    <div className="font-semibold text-primary">+{challenge.points} pts</div>
                    </div>
                ))}
              </div>
              <Button onClick={handleFinishOnboarding} disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Finalizar y Empezar
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
