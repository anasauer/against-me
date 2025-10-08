'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import {
  collection,
  query,
  where,
  doc,
  writeBatch,
  arrayUnion,
} from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FriendRequest } from '@/lib/types';

export function FriendRequests() {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const requestsQuery = useMemo(() => {
    if (!currentUser) return null;
    return query(
      collection(firestore, 'friendRequests'),
      where('receiverId', '==', currentUser.uid),
      where('status', '==', 'pending')
    );
  }, [currentUser, firestore]);

  const { data: requests, loading } = useCollection<FriendRequest & { id: string }>(requestsQuery);

  const handleAccept = async (request: FriendRequest & { id: string }) => {
    if (!currentUser) return;
    try {
      const batch = writeBatch(firestore);

      // 1. Update request status
      const requestRef = doc(firestore, 'friendRequests', request.id);
      batch.update(requestRef, { status: 'accepted' });

      // 2. Add friend to both users
      const currentUserRef = doc(firestore, 'users', currentUser.uid);
      batch.update(currentUserRef, {
        friends: arrayUnion(request.senderId),
      });

      const senderUserRef = doc(firestore, 'users', request.senderId);
      batch.update(senderUserRef, {
        friends: arrayUnion(currentUser.uid),
      });

      await batch.commit();

      toast({
        title: '¡Amigo añadido!',
        description: `Ahora eres amigo/a de ${request.senderName}.`,
      });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: 'Error',
        description: 'No se pudo aceptar la solicitud.',
        variant: 'destructive',
      });
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      const requestRef = doc(firestore, 'friendRequests', requestId);
      await writeBatch(firestore)
        .update(requestRef, { status: 'declined' })
        .commit();
      toast({
        title: 'Solicitud rechazada',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error declining friend request:', error);
      toast({
        title: 'Error',
        description: 'No se pudo rechazar la solicitud.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Amistad</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!requests || requests.length === 0) {
    return null; // Don't show the card if there are no requests
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes de Amistad ({requests.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={req.senderAvatar} />
                <AvatarFallback>{req.senderName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{req.senderName}</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                className="text-green-600 hover:bg-green-100 hover:text-green-700"
                onClick={() => handleAccept(req)}
                aria-label="Accept"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="text-red-600 hover:bg-red-100 hover:text-red-700"
                onClick={() => handleDecline(req.id)}
                aria-label="Decline"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
