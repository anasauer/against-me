'use client';
import { AppHeader } from '@/components/layout/header';
import { SocialFeed } from '@/components/social-feed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { activities } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { useMemo } from 'react';
import { collection, doc, query, where } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { FriendRequests } from '@/components/friend-requests';
import Link from 'next/link';

function FriendList() {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemo(
    () => (currentUser ? doc(firestore, 'users', currentUser.uid) : null),
    [currentUser, firestore]
  );
  const { data: userData } = useDoc<{ friends?: string[] }>(userDocRef);

  const friends = userData?.friends || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amigos ({friends.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {friends.length === 0 ? (
           <div className="text-center text-muted-foreground py-4">
            <p className="mb-2">Aún no tienes amigos.</p>
            <Button asChild size="sm">
              <Link href="/add-friend">Buscar amigos</Link>
            </Button>
          </div>
        ) : (
          friends.map((friendId) => (
            <FriendListItem key={friendId} friendId={friendId} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function FriendListItem({ friendId }: { friendId: string }) {
  const firestore = useFirestore();
  const friendDocRef = useMemo(
    () => doc(firestore, 'users', friendId),
    [firestore, friendId]
  );
  const { data: friendData } = useDoc<UserProfile>(friendDocRef);

  if (!friendData) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          {friendData.avatar && <AvatarImage src={friendData.avatar} />}
          <AvatarFallback>{friendData.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span>{friendData.name}</span>
      </div>
      <Button variant="secondary" size="sm">
        Retar
      </Button>
    </div>
  );
}


export default function SocialPage() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Social" />
      <main className="flex-1 p-4 md:p-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <FriendRequests />
          <SocialFeed activities={activities} />
        </div>
        <div className="space-y-6">
          <FriendList />
        </div>
      </main>
    </div>
  );
}