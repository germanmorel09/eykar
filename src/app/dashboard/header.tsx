'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  Bell,
  LogOut,
  UserCircle,
  Home,
  Wallet,
  BarChart2,
  Target,
  Settings,
  Shapes,
  User,
  CreditCard,
} from 'lucide-react';
import { signOut } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { EykarLogo } from '@/components/icons/eykar-logo';
import { useToast } from '@/components/ui/toaster';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth, useUser } from '@/firebase';

const navItems = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/dashboard/billeteras', label: 'Billeteras', icon: Wallet },
  { href: '/dashboard/categorias', label: 'Categorías', icon: Shapes },
  { href: '/dashboard/objetivos', label: 'Metas', icon: Target },
  { href: '/dashboard/analisis', label: 'Análisis', icon: BarChart2 },
  { href: '/dashboard/ajustes', label: 'Ajustes', icon: Settings },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente.',
      });
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <EykarLogo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Flinzly
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                <span
                  className={cn(
                    'font-semibold',
                    pathname === item.href ? 'text-primary' : ''
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Logo */}
        <div className="md:hidden">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <EykarLogo className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">Flinzly</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-muted-foreground">
                No hay notificaciones
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || ''} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/perfil">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <Link href="/dashboard/facturacion">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Facturación</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/ajustes">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ajustes</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
