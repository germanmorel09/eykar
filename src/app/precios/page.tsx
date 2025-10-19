import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { EykarLogo } from "@/components/icons/eykar-logo";

const features = [
    "Transacciones ilimitadas",
    "Billeteras y cuentas ilimitadas",
    "Creación de metas de ahorro",
    "Reportes visuales",
    "Consejos financieros con IA",
    "Soporte prioritario",
]

export default function PreciosPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
        <div className="absolute top-8">
         <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <EykarLogo className="w-8 h-8 text-primary" />
          <span className="font-headline">Flinzly</span>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Plan Pro</CardTitle>
          <CardDescription>
            Acceso completo a todas las herramientas para potenciar tu salud financiera.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            <div className="text-center">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/ mes</span>
            </div>
          <ul className="grid gap-3 text-sm">
            {features.map((feature) => (
                 <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span>{feature}</span>
                </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/signup">Suscribirse ahora</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    