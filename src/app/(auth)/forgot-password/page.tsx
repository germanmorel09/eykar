'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useToast } from '@/components/ui/toaster';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Button } from '@/components/ui/button';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Por favor, ingresa un correo electrónico válido.' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const auth = useAuth();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);

    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'El servicio de autenticación no está disponible.',
      });
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, data.email);
      setIsSubmitted(true);
      toast({
        title: 'Correo enviado',
        description: 'Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.',
      });
    } catch (error: any) {
      // We still show a success message for security reasons (to not reveal registered emails)
      setIsSubmitted(true);
      toast({
        title: 'Correo enviado',
        description: 'Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">¿Olvidaste tu contraseña?</CardTitle>
        <CardDescription>
            No te preocupes. Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
            <div className="text-center p-4 bg-muted text-muted-foreground rounded-lg">
                <p>El correo de recuperación ha sido enviado. Por favor, revisa tu bandeja de entrada (y la carpeta de spam).</p>
            </div>
        ) : (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="nombre@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar correo de recuperación'}
                    </Button>
                </form>
            </Form>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="link" asChild className="w-full">
            <Link href="/login">Volver a Iniciar Sesión</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
