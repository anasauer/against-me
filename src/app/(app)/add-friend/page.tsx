'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, UserPlus, Search } from 'lucide-react';

type FoundUser = {
  id: string;
  name: string;
  avatar: string;
};

export default function AddFriendPage() {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoundUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !currentUser) return;

    setLoading(true);
    setSearched(true);
    setSearchResults([]);

    try {
      const usersRef = collection(firestore, 'users');
      // Simple search by name. In a real app, you might use a more advanced search service.
      const q = query(
        usersRef,
        where('name', '>=', searchQuery),
        where('name', '<=', searchQuery + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      const users: FoundUser[] = [];
      querySnapshot.forEach((doc) => {
        // Exclude the current user from search results
        if (doc.id !== currentUser.uid) {
          const data = doc.data();
          users.push({
            id: doc.id,
            name: data.name,
            avatar: data.avatar,
          });
        }
      });
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching for users:', error);
      toast({
        title: 'Error de Búsqueda',
        description: 'No se pudieron buscar usuarios. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (receiverId: string) => {
    if (!currentUser) return;
    try {
      const requestsRef = collection(firestore, 'friendRequests');
      // TODO: Check if a request already exists
      await addDoc(requestsRef, {
        senderId: currentUser.uid,
        receiverId: receiverId,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      toast({
        title: '¡Solicitud Enviada!',
        description: 'Tu solicitud de amistad ha sido enviada.',
      });
      // Optionally, disable the button or show a "Request Sent" state
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar la solicitud de amistad.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Añadir Amigos" />
      <main className="flex-1 p-4 md:p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Buscar Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <Input
                type="search"
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Search />}
              </Button>
            </form>

            <div className="space-y-4">
              {loading && <div className="text-center text-muted-foreground">Buscando...</div>}

              {!loading && searchResults.length > 0 && (
                <h3 className="text-lg font-medium">Resultados</h3>
              )}

              {!loading && searched && searchResults.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No se encontraron usuarios con ese nombre.
                </p>
              )}

              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSendRequest(user.id)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Añadir
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
