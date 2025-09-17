import { AppHeader } from '@/components/layout/header';
import { SuggestChallengesForm } from '@/components/suggest-challenges-form';

export default function SuggestPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader title="AI Challenge Suggester" />
      <main className="flex-1 p-4 md:p-6">
        <SuggestChallengesForm />
      </main>
    </div>
  );
}
