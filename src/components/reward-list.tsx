'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import type { Reward } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { useMemo } from 'react';


export function RewardList({ rewards }: { rewards: Reward[] }) {
  const { toast } = useToast();
  const { user: firebaseUser } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemo(() => firebaseUser ? doc(firestore, 'users', firebaseUser.uid) : null, [firebaseUser, firestore]);
  const { data: userProfile } = useDoc<UserProfile>(userDocRef);

  const handleRedeem = (reward: Reward) => {
    const userPoints = userProfile?.points ?? 0;
    
    if (userPoints >= reward.cost) {
      toast({
        title: '¡Recompensa Canjeada!',
        description: `Has canjeado "${reward.title}" con éxito.`,
      });
      // Here you would typically also update the user's points in Firestore
    } else {
      toast({
        variant: 'destructive',
        title: '¡No hay suficientes puntos!',
        description: `Necesitas ${
          reward.cost - userPoints
        } puntos más para canjear esto.`,
      });
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rewards.map((reward) => (
        <Card key={reward.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>{reward.title}</CardTitle>
                <CardDescription>{reward.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow" />
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleRedeem(reward)}
              disabled={!userProfile}
            >
              Canjear por {reward.cost.toLocaleString()} pts
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
