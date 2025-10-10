'use client';
import { AppHeader } from '@/components/layout/header';
import { HistoryStats } from '@/components/history-stats';
import { ChallengeList } from '@/components/challenge-list';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { useMemo } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import type { Challenge } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function HistoryPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const challengesQuery = useMemo(() => {
    if (!user) return null;
    return collection(firestore, `users/${user.uid}/challenges`);
  }, [user, firestore]);

  const { data: challenges, loading } = useCollection<Challenge>(challengesQuery);

  const completedChallenges = useMemo(
    () => challenges?.filter((c) => c.isCompleted) || [],
    [challenges]
  );
  const totalChallenges = challenges?.length || 0;
  const completionRate =
    totalChallenges > 0
      ? Math.round((completedChallenges.length / totalChallenges) * 100)
      : 0;

  const handleChallengeCreated = (
    newChallenge: Omit<Challenge, 'id' | 'isCompleted' | 'userId'>
  ) => {
    if (!user || !challengesQuery) return;

    const challengeToAdd = {
      ...newChallenge,
      isCompleted: false,
      userId: user.uid,
    };

    addDoc(challengesQuery, challengeToAdd).catch((error) => {
      const permissionError = new FirestorePermissionError({
        path: challengesQuery.path,
        operation: 'create',
        requestResourceData: challengeToAdd,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Historial y Estadísticas" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <HistoryStats
          completedCount={completedChallenges.length}
          totalCount={totalChallenges}
          completionRate={completionRate}
        />
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-headline">Retos Completados</h2>
        </div>
        <ChallengeList
          title="Retos Completados"
          challenges={completedChallenges}
          loading={loading}
          onChallengeCreated={handleChallengeCreated}
          showDeleteButton={false}
        />
      </main>
    </div>
  );
}
