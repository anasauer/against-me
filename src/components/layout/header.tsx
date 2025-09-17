'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Coins } from 'lucide-react';
import { user } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/placeholder-images';

export function AppHeader({ title }: { title: string }) {
  const userAvatar = getPlaceholderImage('user-avatar-main');
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-xl font-semibold tracking-tight font-headline">
        {title}
      </h1>
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Coins className="h-6 w-6 text-primary" />
          <span className="font-semibold">{user.points.toLocaleString()}</span>
        </div>
        <Avatar>
          {userAvatar && (
            <AvatarImage
              src={userAvatar.imageUrl}
              data-ai-hint={userAvatar.imageHint}
            />
          )}
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
