import { AppHeader } from '@/components/layout/header';
import { RewardList } from '@/components/reward-list';
import { rewards } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function RewardsPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Rewards" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold font-headline">Redeem Your Points</h2>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Reward
          </Button>
        </div>
        <RewardList rewards={rewards} />
      </main>
    </div>
  );
}
