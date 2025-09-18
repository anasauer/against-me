import { AppHeader } from '@/components/layout/header';
import { ChallengeFriendForm } from '@/components/challenge-friend-form';

export default function ChallengeFriendPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Retar a un Amigo" />
      <main className="flex-1 p-4 md:p-6">
        <ChallengeFriendForm />
      </main>
    </div>
  );
}
