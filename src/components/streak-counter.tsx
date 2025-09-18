'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Zap } from 'lucide-react';
import { user } from '@/lib/data';

export function StreakCounter() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Racha Diaria</CardTitle>
          <Flame className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.dailyStreak} días</div>
          <p className="text-xs text-muted-foreground">
            ¡Sigue así para desbloquear bonificaciones!
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Racha Semanal</CardTitle>
          <Zap className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.weeklyStreak} semanas</div>
          <p className="text-xs text-muted-foreground">¡Estás en racha!</p>
        </CardContent>
      </Card>
    </div>
  );
}
