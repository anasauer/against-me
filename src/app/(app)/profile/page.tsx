'use client';
import { AppHeader } from '@/components/layout/header';
import { HistoryStats } from '@/components/history-stats';
import { ChallengeList } from '@/components/challenge-list';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import type { Challenge } from '@/lib/types';
import { StreakCounter } from '@/components/streak-counter';


export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const challengesQuery = useMemo(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/challenges`);
  }, [user, firestore]);

  const { data: challenges, loading } = useCollection<Challenge>(challengesQuery);

  const completedChallenges = useMemo(() => challenges?.filter((c) => c.isCompleted) || [], [challenges]);
  const totalChallenges = challenges?.length || 0;
  const completionRate =
    totalChallenges > 0
      ? Math.round((completedChallenges.length / totalChallenges) * 100)
      : 0;

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Tu Perfil y Estadísticas" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <StreakCounter />
        <HistoryStats
          completedCount={completedChallenges.length}
          totalCount={totalChallenges}
          completionRate={completionRate}
        />
        <ChallengeList
          title="Retos Completados"
          challenges={completedChallenges}
          loading={loading}
          showAddButton={false}
          showDeleteButton={false}
        />
      </main>
    </div>
  );
}
