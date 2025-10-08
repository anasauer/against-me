'use client';

import { AuthGuard } from '@/components/auth-guard';
import { AppHeader } from '@/components/layout/header';
import { RewardList } from '@/components/reward-list';
import { rewards } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

function RewardsPageContent() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Recompensas" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold font-headline">Canjea Tus Puntos</h2>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Recompensa
          </Button>
        </div>
        <RewardList rewards={rewards} />
      </main>
    </div>
  );
}

export default function RewardsPage() {
  return (
    <AuthGuard>
      <RewardsPageContent />
    </AuthGuard>
  );
}
