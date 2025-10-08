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
import { challenges as suggestedChallenges, rewards as suggestedRewards } from '@/lib/data';
import type { Challenge, Reward } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

type OnboardingStep = 'challenges' | 'rewards';

export default function WelcomePage() {
  const router = useRouter();
  const { user: firebaseUser, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [step, setStep] = useState<OnboardingStep>('challenges');
  const [selectedChallenges, setSelectedChallenges] = useState<Set<string>>(new Set());
  const [selectedRewards, setSelectedRewards] = useState<Set<string>>(new Set());
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
  
  const handleToggleReward = (rewardId: string) => {
    setSelectedRewards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rewardId)) {
        newSet.delete(rewardId);
      } else {
        newSet.add(rewardId);
      }
      return newSet;
    });
  };

  const handleNextStep = () => {
    setStep('rewards');
  };

  const handleFinishOnboarding = async () => {
    if (!firebaseUser || !firestore) return;
    setIsSubmitting(true);

    try {
      const batch = writeBatch(firestore);
      const userDocRef = doc(firestore, 'users', firebaseUser.uid);

      // Add selected challenges
      suggestedChallenges
        .filter((c) => selectedChallenges.has(c.id))
        .forEach((challenge) => {
          const newChallengeRef = doc(collection(firestore, `users/${firebaseUser.uid}/challenges`));
          const challengeData: Omit<Challenge, 'id' | 'recurrence'> & { userId: string } = {
            title: challenge.title,
            description: challenge.description,
            points: challenge.points,
            type: challenge.type,
            isCompleted: false,
            userId: firebaseUser.uid,
          };
          batch.set(newChallengeRef, challengeData);
        });
      
      // We will add rewards in a future step, for now we just mark onboarding as complete

      // Mark onboarding as complete
      batch.update(userDocRef, { hasCompletedOnboarding: true });

      await batch.commit();

      toast({
        title: '¡Todo listo!',
        description: 'Hemos añadido tus primeros retos. ¡A por ellos!',
      });

      router.push('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'No se pudo completar la configuración. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const progressValue = step === 'challenges' ? 50 : 100;
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
            <Logo />
          </div>
          <CardTitle className="text-3xl font-bold">¡Bienvenido a Questify!</CardTitle>
          {step === 'challenges' && (
             <CardDescription className="text-lg text-muted-foreground">
              Paso 1 de 2: Elige algunos retos para empezar.
            </CardDescription>
          )}
          {step === 'rewards' && (
             <CardDescription className="text-lg text-muted-foreground">
              Paso 2 de 2: Define tus propias recompensas.
            </CardDescription>
          )}
           <Progress value={progressValue} className="mt-4 w-1/2 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-6">
            {step === 'challenges' && (
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
                <Button onClick={handleNextStep} className="w-full">
                  Continuar
                </Button>
              </div>
            )}
            
            {step === 'rewards' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recompensas Sugeridas</h3>
                <p className="text-sm text-muted-foreground">¿Qué te motivará? Elige algunas recompensas personales que canjearás con tus puntos.</p>
                <div className="space-y-2 rounded-md border p-4">
                  {suggestedRewards.slice(0, 4).map((reward) => (
                     <div key={reward.id} className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50">
                       <Checkbox
                          id={`reward-${reward.id}`}
                          checked={selectedRewards.has(reward.id)}
                          onCheckedChange={() => handleToggleReward(reward.id)}
                        />
                       <label htmlFor={`reward-${reward.id}`} className="flex-1 cursor-pointer">
                         <span className="font-medium">{reward.title}</span>
                         <p className="text-sm text-muted-foreground">{reward.description}</p>
                       </label>
                       <div className="font-semibold text-primary">{reward.cost} pts</div>
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
            )}

        </CardContent>
      </Card>
    </div>
  );
}
