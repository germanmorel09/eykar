"use client"

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Transaction } from "@/contexts/data-context";
import { useSettings } from "@/contexts/settings-context";
import { useData } from "@/contexts/data-context";

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const { formatCurrency } = useSettings();
  const { wallets, categories } = useData();
  
  const getCategory = (id: string) => categories.find(c => c.id === id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transacciones Recientes</CardTitle>
        <CardDescription>
          Un resumen de tus ingresos y gastos más recientes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile View: List of Cards */}
        <div className="md:hidden space-y-4">
          {transactions.slice(0, 5).map((transaction) => {
            const category = getCategory(transaction.categoryId);
            return category && <div key={transaction.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                <div className="flex flex-col gap-1">
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" style={{ borderColor: category.color, color: category.color }}>
                            {category.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{wallets.find(w => w.id === transaction.walletId)?.name}</span>
                    </div>
                     <span className="text-xs text-muted-foreground">{formatDate(transaction.date)}</span>
                </div>
                <p className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </p>
            </div>
          })}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Billetera</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 5).map((transaction) => {
                const category = getCategory(transaction.categoryId);
                return category && <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" style={{ borderColor: category.color, color: category.color }}>
                      {category.name}
                    </Badge>
                  </TableCell>
                  <TableCell>{wallets.find(w => w.id === transaction.walletId)?.name}</TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              })}
            </TableBody>
          </Table>
        </div>
        {transactions.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>No hay transacciones registradas.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
