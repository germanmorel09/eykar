import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

export default function AnalisisPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
                <h2 className="text-2xl font-bold tracking-tight font-headline">Análisis</h2>
            </div>
            <Card className="flex-1">
                <CardHeader></CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full text-center">
                    <BarChart2 className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">Próximamente</h3>
                    <p className="text-muted-foreground">Estamos preparando un análisis detallado de tus finanzas.</p>
                </CardContent>
            </Card>
        </main>
    );
}
