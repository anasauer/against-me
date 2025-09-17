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
import { user } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export function RewardList({ rewards }: { rewards: Reward[] }) {
  const { toast } = useToast();

  const handleRedeem = (reward: Reward) => {
    if (user.points >= reward.cost) {
      toast({
        title: 'Reward Redeemed!',
        description: `You've successfully redeemed "${reward.title}".`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Not enough points!',
        description: `You need ${
          reward.cost - user.points
        } more points to redeem this.`,
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
            <Button className="w-full" onClick={() => handleRedeem(reward)}>
              Redeem for {reward.cost.toLocaleString()} pts
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
