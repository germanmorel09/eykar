'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/toaster';
import { countries, currencies } from '@/lib/localization';
import { useAuth, useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const signupFormSchema = z
  .object({
    firstName: z.string().min(2, { message: 'El nombre es obligatorio.' }),
    lastName: z.string().min(2, { message: 'El apellido es obligatorio.' }),
    email: z
      .string()
      .email({ message: 'Por favor, ingresa un correo electrónico válido.' }),
    password: z
      .string()
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
    confirmPassword: z.string(),
    country: z.string({ required_error: 'Debes seleccionar un país.' }),
    currency: z.string({ required_error: 'Debes seleccionar una moneda.' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);
  
    if (!auth || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'El servicio de autenticación no está disponible.',
      });
      setIsLoading(false);
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
  
      await updateProfile(user, { displayName: `${data.firstName} ${data.lastName}` });
  
      const userProfile = {
        id: user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        currency: data.currency,
        country: data.country,
        createdAt: new Date().toISOString(),
      };
  
      const profileRef = doc(firestore, 'users', user.uid);
      
      setDoc(profileRef, userProfile).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: profileRef.path,
          operation: 'create',
          requestResourceData: userProfile,
        });
        errorEmitter.emit('permission-error', permissionError);
        
        // Also show a toast to the user
        toast({
            variant: 'destructive',
            title: 'Error al registrarse',
            description: "No se pudo crear el perfil de usuario. Es posible que no tengas permisos."
        });
      });
  
      toast({
        title: '¡Cuenta creada exitosamente!',
        description: 'Serás redirigido para iniciar sesión.',
      });
      router.push('/login');
  
    } catch (error: any) {
      const errorMessage =
        error.code === 'auth/email-already-in-use'
          ? 'Este correo electrónico ya está en uso.'
          : 'Ocurrió un error durante la autenticación.';
      toast({
        variant: 'destructive',
        title: 'Error al registrarse',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Crear Cuenta</CardTitle>
        <CardDescription>
          Ingresa tus datos para crear una nueva cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="nombre@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>País</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu país" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {countries.map(country => (
                            <SelectItem key={country.code} value={country.code}>
                            {country.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu moneda" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {currencies.map(currency => (
                            <SelectItem key={currency.code} value={currency.code}>
                            {currency.name} ({currency.symbol})
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Registrarse'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm">
        <p>
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="underline font-medium">
            Inicia Sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
