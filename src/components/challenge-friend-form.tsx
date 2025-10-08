'use client';
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Swords } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, collection, query, where, documentId } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import Link from 'next/link';


const formSchema = z.object({
  friend: z.string().min(1, 'Por favor, selecciona un amigo.'),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  description: z.string().optional(),
  reward: z.string().min(2, 'Por favor, especifica una recompensa.'),
});

export function ChallengeFriendForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemo(
    () => (currentUser ? doc(firestore, 'users', currentUser.uid) : null),
    [currentUser, firestore]
  );
  const { data: userData } = useDoc<{ friends?: string[] }>(userDocRef);
  const friendIds = userData?.friends || [];

  const friendsQuery = useMemo(() => {
    if (!firestore || friendIds.length === 0) return null;
    return query(collection(firestore, 'users'), where(documentId(), 'in', friendIds));
  }, [firestore, friendIds]);

  const { data: friends, loading: friendsLoading } = useCollection<UserProfile & {id: string}>(friendsQuery);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      friend: '',
      title: '',
      description: '',
      reward: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log('Challenging friend with values:', values);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: '¡Reto Enviado!',
      description: `Has retado a ${
        friends?.find((f) => f.id === values.friend)?.name
      } a completar "${values.title}".`,
    });
    
    form.reset();
    setIsLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Crea un Reto para un Amigo</CardTitle>
          <CardDescription>
            Elige a un amigo, define un reto y establece una recompensa. ¡La pagarás cuando lo completen!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {friendsLoading ? (
             <div className="flex justify-center items-center h-24">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !friends || friends.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              <p className="mb-4">No tienes amigos para retar todavía.</p>
              <Button asChild>
                <Link href="/add-friend">Buscar Amigos</Link>
              </Button>
            </div>
          ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="friend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿A quién quieres retar?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un amigo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {friends.map(friend => (
                          <SelectItem key={friend.id} value={friend.id}>{friend.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título del Reto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Ganarme en una partida de ajedrez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Añade más detalles sobre el reto..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recompensa</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Te invito a cenar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Swords className="mr-2 h-4 w-4" />
                )}
                Enviar Reto
              </Button>
            </form>
          </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
