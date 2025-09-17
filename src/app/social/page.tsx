import { AppHeader } from '@/components/layout/header';
import { SocialFeed } from '@/components/social-feed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { activities } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/placeholder-images';

const friends = [
  {
    name: 'Jessica',
    avatarId: 'jessica-avatar',
  },
  {
    name: 'Mark',
    avatarId: 'mark-avatar',
  },
  {
    name: 'Samantha',
    avatarId: 'samantha-avatar',
  },
  {
    name: 'David',
    avatarId: 'david-avatar',
  },
];

export default function SocialPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Social" />
      <main className="flex-1 p-4 md:p-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SocialFeed activities={activities} />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Amigos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {friends.map((friend) => {
                const avatar = getPlaceholderImage(friend.avatarId);
                return (
                  <div
                    key={friend.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {avatar && (
                          <AvatarImage
                            src={avatar.imageUrl}
                            data-ai-hint={avatar.imageHint}
                          />
                        )}
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{friend.name}</span>
                    </div>
                    <Button variant="secondary" size="sm">
                      Retar
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
