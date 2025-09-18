'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  suggestChallenges,
  type SuggestChallengesOutput,
} from '@/ai/flows/suggest-challenges';
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
import { Lightbulb, Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  userPreferences: z
    .string()
    .min(10, 'Por favor, describe las preferencias del usuario con más detalle.'),
  suggestedReward: z.string().optional(),
});

export function SuggestChallengesForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] =
    useState<SuggestChallengesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userPreferences: '',
      suggestedReward: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestChallenges(values);
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Ocurrió un error',
        description: 'No se pudieron obtener sugerencias. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Herramienta de Sugerencia de Retos</CardTitle>
          <CardDescription>
            Describe los gustos de un amigo o pareja para obtener ideas de retos y recompensas personalizadas para esa persona.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferencias del Usuario</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ej: Le encanta el senderismo, está aprendiendo a cocinar, disfruta leyendo novelas de fantasía..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="suggestedReward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recompensa Sugerida (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Un par de zapatillas nuevas, una cena elegante, un día de spa..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Sugerir Retos
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="p-6 flex items-center justify-center">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Generando ideas...</p>
          </CardContent>
        </Card>
      )}

      {suggestions && suggestions.challenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Retos Sugeridos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {suggestions.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 mt-1 text-primary" />
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
