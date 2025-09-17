import Link from 'next/link';
import { AppHeader } from '@/components/layout/header';
import { StreakCounter } from '@/components/streak-counter';
import { ChallengeList } from '@/components/challenge-list';
import { SocialFeed } from '@/components/social-feed';
import { challenges, activities } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';

export default function HomePage() {
  const todaysChallenges = challenges
    .filter((c) => c.type === 'daily' || c.isCompleted === false)
    .slice(0, 3);

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Panel" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <StreakCounter />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ChallengeList
              title="Retos de Hoy"
              challenges={todaysChallenges}
            />
          </div>
          <div className="space-y-6">
            <div className="bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold">¡Reclama Tus Recompensas!</h3>
              <p className="mt-2 mb-4 text-primary-foreground/80">
                Tienes puntos para gastar. Echa un vistazo a las recompensas que has establecido para ti.
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
