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
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import type { Challenge } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { CreateChallengeForm } from './create-challenge-form';

export function ChallengeList({
  title,
  challenges,
  loading,
  showDeleteButton = true,
  onChallengeCreated,
}: {
  title: string;
  challenges: Challenge[];
  loading: boolean;
  showDeleteButton?: boolean;
  onChallengeCreated: (
    challenge: Omit<Challenge, 'id' | 'isCompleted' | 'userId'>
  ) => void;
}) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleToggle = (challengeId: string, isCompleted: boolean) => {
    if (!user) return;
    const challengeRef = doc(
      firestore,
      `users/${user.uid}/challenges`,
      challengeId
    );
    const challenge = challenges.find((c) => c.id === challengeId);
    const updatedData = { isCompleted: !isCompleted };

    updateDoc(challengeRef, updatedData)
      .then(() => {
        if (!isCompleted && challenge) {
          toast({
            title: '¡Reto Completado!',
            description: `Has ganado ${challenge.points} puntos.`,
          });
        }
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: challengeRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleDelete = (challengeId: string) => {
    if (!user) return;
    const challengeRef = doc(
      firestore,
      `users/${user.uid}/challenges`,
      challengeId
    );
    deleteDoc(challengeRef)
      .then(() => {
        toast({
          title: 'Reto Eliminado',
          description: 'El reto ha sido eliminado de tu lista.',
          variant: 'destructive',
        });
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: challengeRef.path,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const completedCount = challenges.filter((c) => c.isCompleted).length;
  const progress =
    challenges.length > 0 ? (completedCount / challenges.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="grid gap-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {loading
                ? 'Cargando...'
                : `${completedCount} de ${challenges.length} completados.`}
            </CardDescription>
          </div>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center text-muted-foreground py-4 space-y-4">
             <p>No hay retos aquí todavía.</p>
             <CreateChallengeForm onChallengeCreated={onChallengeCreated}>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    ¡Crea uno nuevo!
                </Button>
            </CreateChallengeForm>
          </div>
        ) : (
          challenges.map((challenge) => (
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
                  handleToggle(challenge.id, challenge.isCompleted);
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
          ))
        )}
      </CardContent>
    </Card>
  );
}