"use client";

import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/contexts/settings-context";

export default function AjustesPage() {
    const { settings } = useSettings();

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
                <h2 className="text-2xl font-bold tracking-tight font-headline">Ajustes</h2>
            </div>
            <div className="grid gap-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuración de la Cuenta</CardTitle>
                        <CardDescription>
                            Gestiona tus preferencias y la configuración de tu cuenta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Moneda</Label>
                            <p className="text-sm p-2 mt-2 font-medium bg-muted text-muted-foreground rounded-md">
                                Tu moneda actual es {settings.currency}.
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Suscripción</CardTitle>
                        <CardDescription>
                            Gestiona tu plan y facturación.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-4 border rounded-lg">
                            <div>
                                <p className="font-semibold">Plan Pro</p>
                                <p className="text-sm text-green-600 font-medium">Activo</p>
                            </div>
                            <Button asChild variant="outline">
                                <Link href="/dashboard/facturacion">Gestionar Suscripción</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
