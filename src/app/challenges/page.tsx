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
      <AppHeader title="Retos" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold font-headline">Gestiona Tus Misiones</h2>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Reto
          </Button>
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="daily">Diarios</TabsTrigger>
            <TabsTrigger value="weekly">Semanales</TabsTrigger>
            <TabsTrigger value="special">Especiales</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <ChallengeList
              title="Todos los Retos"
              challenges={challenges}
              showAddButton={false}
            />
          </TabsContent>
          <TabsContent value="daily" className="mt-4">
            <ChallengeList
              title="Retos Diarios"
              challenges={daily}
              showAddButton={false}
            />
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
            <ChallengeList
              title="Retos Semanales"
              challenges={weekly}
              showAddButton={false}
            />
          </TabsContent>
          <TabsContent value="special" className="mt-4">
            <ChallengeList
              title="Retos Especiales"
              challenges={special}
              showAddButton={false}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
