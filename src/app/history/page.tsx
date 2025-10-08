'use client';
import { AuthGuard } from '@/components/auth-guard';
import { AppHeader } from '@/components/layout/header';
import { HistoryStats } from '@/components/history-stats';
import { ChallengeList } from '@/components/challenge-list';
import { challenges } from '@/lib/data';

function HistoryPageContent() {
  const completedChallenges = challenges.filter((c) => c.isCompleted);
  const totalChallenges = challenges.length;
  const completionRate =
    totalChallenges > 0
      ? Math.round((completedChallenges.length / totalChallenges) * 100)
      : 0;

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Historial y Estadísticas" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <HistoryStats
          completedCount={completedChallenges.length}
          totalCount={totalChallenges}
          completionRate={completionRate}
        />
        <ChallengeList
          title="Retos Completados"
          challenges={completedChallenges}
          showAddButton={false}
          showDeleteButton={false}
        />
      </main>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <AuthGuard>
      <HistoryPageContent />
    </AuthGuard>
  );
}
