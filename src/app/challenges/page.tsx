import { AppHeader } from '@/components/layout/header';
import { ChallengeList } from '@/components/challenge-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { challenges } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ChallengesPage() {
  const daily = challenges.filter((c) => c.type === 'daily');
  const weekly = challenges.filter((c) => c.type === 'weekly');
  const special = challenges.filter((c) => c.type === 'special');

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Challenges" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold font-headline">Manage Your Quests</h2>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Challenge
          </Button>
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="special">Special</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <ChallengeList
              title="All Challenges"
              challenges={challenges}
              showAddButton={false}
            />
          </TabsContent>
          <TabsContent value="daily" className="mt-4">
            <ChallengeList
              title="Daily Challenges"
              challenges={daily}
              showAddButton={false}
            />
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
            <ChallengeList
              title="Weekly Challenges"
              challenges={weekly}
              showAddButton={false}
            />
          </TabsContent>
          <TabsContent value="special" className="mt-4">
            <ChallengeList
              title="Special Challenges"
              challenges={special}
              showAddButton={false}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
