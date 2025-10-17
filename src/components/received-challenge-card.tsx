
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Swords, X } from 'lucide-react';
import type { ReceivedChallenge } from '@/lib/data';

export function ReceivedChallengeCard({
  challenge,
  onAccept,
  onDecline,
}: {
  challenge: ReceivedChallenge;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <Card className="bg-accent/20 border-accent">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Swords className="w-8 h-8 text-accent-foreground" />
          <div>
            <CardTitle className="text-xl">¡Has Recibido un Reto!</CardTitle>
            <CardDescription className="flex items-center gap-2">
              De:
              <Avatar className="w-6 h-6">
                <AvatarImage src={challenge.from.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {challenge.from.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold">{challenge.from.name}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">"{challenge.title}"</p>
        <p className="text-sm text-muted-foreground mt-1">
          Recompensa: <span className="font-bold">{challenge.reward}</span>
        </p>
      </CardContent>
      <CardFooter className="gap-3">
        <Button className="w-full" onClick={() => onAccept()}>
          <Check className="mr-2 h-4 w-4" />
          Aceptar
        </Button>
        <Button variant="outline" className="w-full" onClick={() => onDecline()}>
          <X className="mr-2 h-4 w-4" />
          Rechazar
        </Button>
      </CardFooter>
    </Card>
  );
}
