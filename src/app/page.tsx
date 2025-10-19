'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EykarLogo } from '@/components/icons/eykar-logo';

const features = [
    "Controla tus gastos",
    "Ahorra dinero",
    "Logra tus objetivos financieros"
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 w-full max-w-5xl">
        <header className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="font-headline text-xl sm:text-2xl">Flinzly</span>
            <EykarLogo className="w-6 h-6 text-primary" />
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" asChild size="sm" className="px-2 sm:px-4">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild size="sm" className="px-3 sm:px-4">
              <Link href="/signup">Regístrate</Link>
            </Button>
          </nav>
        </header>
      </div>

      <main className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <div className="container mx-auto px-4 w-full max-w-5xl">
          <div className="bg-card p-6 sm:p-12 rounded-2xl shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl font-bold font-headline tracking-tight">
                  Administra tus finanzas
                </h1>
                <p className="text-md md:text-lg text-muted-foreground">
                  Toma el control de tu dinero con nuestras herramientas de gestión fáciles de usar.
                </p>
                <div className="flex flex-col items-start">
                    <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
                        Empieza tu prueba de 7 días
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">$4.99/mes</p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                  {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-5 w-5 bg-primary text-primary-foreground rounded-full p-0.5" />
                          <span className="font-medium">{feature}</span>
                      </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <Image
                  src="https://picsum.photos/seed/finance-dashboard/600/400"
                  alt="Flinzly app mockup"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                  data-ai-hint="app mockup"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Flinzly. Todos los derechos reservados.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/terms" className="hover:text-primary">Términos de Servicio</Link>
            <Link href="/privacy" className="hover:text-primary">Política de Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
