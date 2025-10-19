"use client";

import { useData } from "@/contexts/data-context";
import { FinancialAdvice } from '@/components/dashboard/financial-advice';
import { BalanceSummary } from "@/components/dashboard/balance-summary";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { ExpensesChart } from "@/components/dashboard/expenses-chart";
import { SavingsGoals } from "@/components/dashboard/savings-goals";
import { AddTransactionDialog } from "@/components/dashboard/add-transaction-dialog";
import { useUser } from "@/firebase";

export default function DashboardPage() {
    const { 
        transactions, 
        wallets, 
        categories, 
        goals,
        addTransaction, 
        handleGoalContribution,
        deleteGoal,
        isDataLoading 
    } = useData();
    const { user } = useUser();

    // Calculate totals - memoize these for performance in a real app
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = wallets.reduce((sum, w) => sum + w.balance, 0);

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight font-headline">Hola, {user?.displayName?.split(' ')[0] || 'bienvenido/a'} de nuevo 👋</h2>
                    <p className="text-muted-foreground">Aquí tienes un resumen de tu estado financiero.</p>
                </div>
                <AddTransactionDialog 
                    onTransactionAdded={addTransaction}
                    wallets={wallets}
                    categories={categories}
                />
            </div>

            <BalanceSummary totalIncome={totalIncome} totalExpenses={totalExpenses} balance={balance} />
            
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <ExpensesChart transactions={transactions} />
                </div>
                <div>
                    <SavingsGoals 
                        goals={goals} 
                        wallets={wallets} 
                        onGoalContribution={handleGoalContribution}
                        onDeleteGoal={deleteGoal}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <div className="xl:col-span-2">
                   <RecentTransactions transactions={transactions} />
                </div>
                <div>
                    <FinancialAdvice />
                </div>
            </div>
        </main>
    );
}
