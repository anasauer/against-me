'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

// This is a client component that listens for custom application-wide events
// and handles them appropriately. For now, it just listens for permission errors.
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // In a production environment, you might want to log this to a service
      // like Sentry or Google Analytics.
      // For development, we'll throw it so Next.js can display its overlay.
      if (process.env.NODE_ENV === 'development') {
        throw error;
      } else {
        // In production, just show a generic toast.
        console.error(error); // Also log it to the console for debugging.
        toast({
          variant: 'destructive',
          title: 'Error de Permisos',
          description: 'No tienes permiso para realizar esta acción.',
        });
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null; // This component does not render anything.
}
