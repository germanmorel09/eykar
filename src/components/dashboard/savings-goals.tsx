"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { type Goal, type Wallet } from "@/contexts/data-context";
import { Target, Trash2 } from 'lucide-react';
import { ManageGoalContributionDialog } from "./manage-goal-contribution-dialog";
import { useToast } from "@/components/ui/toaster";
import { useSettings } from "@/contexts/settings-context";


interface SavingsGoalsProps {
  goals: Goal[];
  wallets: Wallet[];
  onGoalContribution: (goalId: string, amount: number, walletId: string, type: 'deposit' | 'withdraw') => void;
  onDeleteGoal: (goalId: string) => void;
}

export function SavingsGoals({ goals, wallets, onGoalContribution, onDeleteGoal }: SavingsGoalsProps) {
  const { toast } = useToast();
  const { formatCurrency } = useSettings();

  const handleDelete = (goalId: string) => {
    onDeleteGoal(goalId);
    toast({
      title: "Meta eliminada",
      description: "La meta de ahorro ha sido eliminada.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metas de Ahorro</CardTitle>
        <CardDescription>
          Sigue el progreso de tus objetivos financieros.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.length > 0 ? (
            goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
                <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{goal.name}</p>
                    </div>
                     <div className="flex items-center gap-2">
                        <ManageGoalContributionDialog
                            goal={goal}
                            wallets={wallets}
                            onContribute={onGoalContribution}
                        />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Eliminar meta</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente la meta de ahorro
                                    "{goal.name}". El dinero no será devuelto a ninguna billetera.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleDelete(goal.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Eliminar
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                     </div>
                </div>
                <div>
                     <p className="text-sm font-medium text-right">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </p>
                    <Progress value={progress} />
                    <p className="text-xs text-muted-foreground text-right">{progress.toFixed(0)}% completado</p>
                </div>
                </div>
            );
            })
        ) : (
            <div className="text-center text-muted-foreground py-8">
                <p>Aún no has creado ninguna meta.</p>
                <p>¡Define tu primer objetivo para empezar a ahorrar!</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
