import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Zap } from 'lucide-react';
import { user } from '@/lib/data';

export function StreakCounter() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
          <Flame className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.dailyStreak} days</div>
          <p className="text-xs text-muted-foreground">
            Keep it up to unlock bonuses!
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Weekly Streak</CardTitle>
          <Zap className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.weeklyStreak} weeks</div>
          <p className="text-xs text-muted-foreground">You're on a roll!</p>
        </CardContent>
      </Card>
    </div>
  );
}
