"use client";

import { useData } from "@/contexts/data-context";
import { CreateGoalDialog } from "@/components/dashboard/create-goal-dialog";
import { SavingsGoals } from "@/components/dashboard/savings-goals";

export default function ObjetivosPage() {
    const { goals, wallets, addGoal, handleGoalContribution, deleteGoal } = useData();

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
             <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight font-headline">Tus Metas</h2>
                    <p className="text-muted-foreground">Define tus sueños y observa cómo se hacen realidad.</p>
                </div>
                <CreateGoalDialog onGoalCreated={addGoal} />
            </div>
            <div className="max-w-2xl mx-auto w-full">
               <SavingsGoals
                    goals={goals}
                    wallets={wallets}
                    onGoalContribution={handleGoalContribution}
                    onDeleteGoal={deleteGoal}
                />
            </div>
        </main>
    );
}
