'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Activity } from '@/lib/data';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function SocialFeed({ activities }: { activities: Activity[] }) {
  const [likedActivities, setLikedActivities] = useState<Set<string>>(
    new Set()
  );

  const toggleLike = (activityId: string) => {
    setLikedActivities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad de Amigos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage
                  src={activity.user.avatar}
                  data-ai-hint={activity.user.avatarHint}
                />
                <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p>
                  <span className="font-semibold">{activity.user.name}</span>{' '}
                  {activity.action}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleLike(activity.id)}
                aria-label="Me gusta"
              >
                <Heart
                  className={cn(
                    'h-5 w-5',
                    likedActivities.has(activity.id)
                      ? 'text-red-500 fill-current'
                      : 'text-muted-foreground'
                  )}
                />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
