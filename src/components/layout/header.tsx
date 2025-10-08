'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Coins } from 'lucide-react';
import { useUser } from '@/firebase';
import { user as mockUser } from '@/lib/data'; // Temp for points

export function AppHeader({ title }: { title: string }) {
  const { user } = useUser();
  // TODO: Replace mockUser.points with points from Firestore user document
  const points = mockUser.points;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-xl font-semibold tracking-tight font-headline">
        {title}
      </h1>
      {user && (
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-primary" />
            <span className="font-semibold">{points.toLocaleString()}</span>
          </div>
          <Avatar>
            {user.photoURL && <AvatarImage src={user.photoURL} />}
            <AvatarFallback>
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  );
}
