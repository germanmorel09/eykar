"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";

import { getAdviceAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FinancialAdvice() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAdvice = async () => {
    setIsLoading(true);
    setError(null);
    setAdvice(null);
    const result = await getAdviceAction();
    if (result.error) {
      setError(result.error);
    } else {
      setAdvice(result.advice ?? null);
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <span>Consejo Financiero Personalizado</span>
        </CardTitle>
        <CardDescription>
          Recibe consejos generados por IA basados en tus hábitos de gasto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {advice && <p className="text-sm text-muted-foreground">{advice}</p>}
        
        {!isLoading && !advice && !error && (
            <p className="text-sm text-center text-muted-foreground pt-4">Haz clic en el botón para generar un nuevo consejo.</p>
        )}

        <Button onClick={handleGetAdvice} disabled={isLoading} className="w-full">
          {isLoading ? "Generando..." : "Obtener Consejo"}
        </Button>
      </CardContent>
    </Card>
  );
}
