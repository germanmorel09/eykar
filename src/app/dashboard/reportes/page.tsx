import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function ReportesPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
                <h2 className="text-2xl font-bold tracking-tight font-headline">Reportes Financieros</h2>
            </div>
            <Card className="flex-1">
                <CardHeader></CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full text-center">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">Próximamente</h3>
                    <p className="text-muted-foreground">Estamos trabajando en reportes semanales y mensuales detallados.</p>
                </CardContent>
            </Card>
        </main>
    );
}
