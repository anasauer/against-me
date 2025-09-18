'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Challenge } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function ChallengeList({
  title,
  challenges,
  showAddButton = true,
  showDeleteButton = true,
}: {
  title: string;
  challenges: Challenge[];
  showAddButton?: boolean;
  showDeleteButton?: boolean;
}) {
  const { toast } = useToast();

  const [localChallenges, setLocalChallenges] = useState(challenges);

  const handleToggle = (challenge: Challenge) => {
    const wasCompleted = challenge.isCompleted;
    setLocalChallenges(
      localChallenges.map((c) =>
        c.id === challenge.id ? { ...c, isCompleted: !c.isCompleted } : c
      )
    );
    if (!wasCompleted) {
      toast({
        title: '¡Reto Completado!',
        description: `Has ganado ${challenge.points} puntos.`,
      });
    }
  };

  const handleDelete = (challengeId: string) => {
    setLocalChallenges(localChallenges.filter((c) => c.id !== challengeId));
    toast({
      title: 'Reto Eliminado',
      description: 'El reto ha sido eliminado de tu lista.',
      variant: 'destructive',
    });
  };

  const completedCount = localChallenges.filter((c) => c.isCompleted).length;
  const progress =
    localChallenges.length > 0 ? (completedCount / localChallenges.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {completedCount} de {localChallenges.length} completados.
            </CardDescription>
          </div>
          {showAddButton && (
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Reto
            </Button>
          )}
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-2">
        {localChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className={cn(
              'flex items-center gap-4 p-3 rounded-lg transition-colors',
              challenge.isCompleted
                ? 'bg-muted/50'
                : 'bg-background hover:bg-muted/50'
            )}
          >
            <Checkbox
              id={`challenge-${challenge.id}`}
              checked={challenge.isCompleted}
              onCheckedChange={() => {
                handleToggle(challenge);
              }}
              className="transition-transform active:scale-95"
            />
            <div className="flex-1">
              <label
                htmlFor={`challenge-${challenge.id}`}
                className={cn(
                  'font-medium cursor-pointer',
                  challenge.isCompleted && 'line-through text-muted-foreground'
                )}
              >
                {challenge.title}
              </label>
              <p
                className={cn(
                  'text-sm text-muted-foreground',
                  challenge.isCompleted && 'line-through'
                )}
              >
                {challenge.description}
              </p>
            </div>
            <div className="font-semibold text-primary">
              +{challenge.points} pts
            </div>
            {showDeleteButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(challenge.id)}
                aria-label="Eliminar reto"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
