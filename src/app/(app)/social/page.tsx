'use client';
import { AppHeader } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { useMemo } from 'react';
import { collection, doc, query, where, documentId } from 'firebase/firestore';
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

  const friendIds = userData?.friends || [];
  
  const friendsQuery = useMemo(() => {
    if (friendIds.length === 0) return null;
    return query(collection(firestore, 'users'), where(documentId(), 'in', friendIds));
  }, [friendIds]);

  const { data: friends, loading } = useCollection<UserProfile & {id: string}>(friendsQuery);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Amigos ({friends?.length ?? 0})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center text-muted-foreground py-4">Cargando amigos...</div>
        ) : friends && friends.length === 0 ? (
           <div className="text-center text-muted-foreground py-4">
            <p className="mb-2">Aún no tienes amigos.</p>
            <Button asChild size="sm">
              <Link href="/add-friend">Buscar amigos</Link>
            </Button>
          </div>
        ) : (
          friends?.map((friend) => (
            <FriendListItem key={friend.id} friend={friend} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function FriendListItem({ friend }: { friend: UserProfile & { id: string } }) {
  
  if (!friend) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          {friend.avatar && <AvatarImage src={friend.avatar} />}
          <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span>{friend.name}</span>
      </div>
       <Button asChild variant="secondary" size="sm">
        <Link href="/challenge-friend">Retar</Link>
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
        </div>
        <div className="space-y-6">
          <FriendList />
        </div>
      </main>
    </div>
  );
}
