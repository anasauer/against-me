
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/data';

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  avatar: z.string().url('Por favor, introduce una URL de imagen válida.').optional().or(z.literal('')),
});

export function EditProfileForm({ user, onSave }: { user: User, onSave: (data: z.infer<typeof formSchema>) => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const userAvatar = getPlaceholderImage('user-avatar-main');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      avatar: user.avatar,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Saving profile with values:', values);
    onSave(values);
    toast({
      title: '¡Perfil Actualizado!',
      description: 'Tu nombre y foto de perfil han sido guardados.',
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Editar Perfil</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col items-center space-y-4">
               <Avatar className="w-24 h-24">
                {userAvatar && (
                    <AvatarImage
                    src={userAvatar.imageUrl}
                    data-ai-hint={userAvatar.imageHint}
                    />
                )}
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              <Button type="button" variant="outline">Cambiar Foto</Button>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
