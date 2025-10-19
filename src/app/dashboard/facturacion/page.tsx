'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, CreditCard, Download } from 'lucide-react';

const invoices = [
  { id: 'INV-2024-003', date: '1 de Julio, 2024', amount: '$9.99' },
  { id: 'INV-2024-002', date: '1 de Junio, 2024', amount: '$9.99' },
  { id: 'INV-2024-001', date: '1 de Mayo, 2024', amount: '$9.99' },
];

export default function FacturacionPage() {
  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  const formattedNextBillingDate = nextBillingDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          Facturación y Suscripción
        </h2>
      </div>
      <div className="grid gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Tu Plan Actual</CardTitle>
            <CardDescription>
              Información sobre tu suscripción al Plan Pro.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg bg-muted/50">
              <div className="mb-4 sm:mb-0">
                <p className="text-lg font-semibold">Flinzly Pro</p>
                <p className="text-3xl font-bold">$9.99/mes</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Suscripción Activa
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-muted-foreground">
                  Tu plan se renueva el
                </p>
                <p className="font-semibold">{formattedNextBillingDate}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" disabled>
                Cambiar de Plan (No disponible)
              </Button>
              <Button variant="destructive" disabled>
                Cancelar Suscripción (No disponible)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Método de Pago</CardTitle>
            <CardDescription>
              La tarjeta que utilizas para tu suscripción.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Visa terminada en 4242</p>
                  <p className="text-sm text-muted-foreground">Expira 12/2026</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" disabled>
                Actualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Facturación</CardTitle>
            <CardDescription>
              Aquí puedes ver y descargar tus facturas anteriores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {invoices.map(invoice => (
                <li
                  key={invoice.id}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">
                      Fecha: {invoice.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{invoice.amount}</span>
                    <Button variant="outline" size="sm" disabled>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Las facturas se generan con fines de demostración.
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
