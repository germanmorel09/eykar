'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Mail,
  ShieldAlert,
  User,
  Wallet,
} from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { useAuth, useUser } from '@/firebase';
import { deleteUser } from 'firebase/auth';
import { useToast } from '@/components/ui/toaster';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function PerfilPage() {
  const { settings, isSettingsLoading } = useSettings();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user || !auth) return;

    setIsDeleting(true);
    try {
      await deleteUser(user);
      toast({
        title: 'Cuenta eliminada',
        description:
          'Tu cuenta ha sido eliminada permanentemente. Te echaremos de menos.',
      });
      router.push('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      let description =
        'Ocurrió un error al eliminar tu cuenta. Por favor, inténtalo de nuevo.';
      if (error.code === 'auth/requires-recent-login') {
        description =
          'Esta operación es sensible y requiere una autenticación reciente. Por favor, cierra sesión y vuelve a iniciarla antes de intentarlo de nuevo.';
      }
      toast({
        variant: 'destructive',
        title: 'Error al eliminar la cuenta',
        description: description,
      });
      setIsDeleting(false);
    }
  };

  if (isUserLoading || isSettingsLoading) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando perfil...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center">
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          Tu Perfil
        </h2>
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
          <CardDescription>Los detalles de tu perfil.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.photoURL || ''} alt="Foto de perfil" />
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1.5">
              <h3 className="text-xl font-semibold">
                {user?.displayName || 'Usuario'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {user?.email || 'usuario@ejemplo.com'}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Correo Electrónico</Label>
              <div className="flex items-center gap-2 p-2 h-10 border rounded-md bg-muted">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {user?.email || 'No disponible'}
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currency">Moneda</Label>
              <div className="flex items-center gap-2 p-2 h-10 border rounded-md bg-muted">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span id="currency" className="text-sm text-muted-foreground">
                  {settings.currency}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
          <CardDescription>Gestiona tus ajustes de seguridad.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Funcionalidad no disponible temporalmente.
          </p>
          <Button variant="secondary" disabled>
            Cambiar Contraseña
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Zona de Peligro
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Esta acción eliminará tu cuenta y todos tus datos permanentemente.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  'Eliminar mi Cuenta'
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará
                  permanentemente tu cuenta y se borrarán todos tus datos de
                  nuestros servidores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sí, eliminar mi cuenta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </main>
  );
}