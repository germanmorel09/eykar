"use client"

import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Transaction, Category } from "@/contexts/data-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useData } from "@/contexts/data-context"


interface ExpensesChartProps {
    transactions: Transaction[];
}

export function ExpensesChart({ transactions }: ExpensesChartProps) {
  const { categories } = useData();
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const monthlyExpenses = expenseCategories.map(category => {
    const total = transactions
      .filter(t => t.type === 'expense' && t.categoryId === category.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: category.name, total, fill: category.color };
  }).filter(item => item.total > 0);

  const chartConfig = Object.fromEntries(
    monthlyExpenses.map((category) => [
      category.name,
      {
        label: category.name,
        color: category.fill,
      },
    ])
  );

  return (
     <Card>
      <CardHeader>
        <CardTitle>Análisis de Gastos</CardTitle>
        <CardDescription>Un desglose de tus gastos por categoría para el mes actual.</CardDescription>
      </CardHeader>
      <CardContent>
        {monthlyExpenses.length > 0 ? (
          <Tabs defaultValue="bar">
              <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="bar">Gráfico de Barras</TabsTrigger>
                  <TabsTrigger value="pie">Gráfico Circular</TabsTrigger>
              </TabsList>
              <TabsContent value="bar">
                  <div className="h-[300px]">
                      <ChartContainer config={chartConfig}>
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={monthlyExpenses}>
                              <XAxis
                                  dataKey="name"
                                  stroke="hsl(var(--muted-foreground))"
                                  fontSize={12}
                                  tickLine={false}
                                  axisLine={false}
                              />
                              <YAxis
                                  stroke="hsl(var(--muted-foreground))"
                                  fontSize={12}
                                  tickLine={false}
                                  axisLine={false}
                                  tickFormatter={(value) => `$${value}`}
                              />
                              <ChartTooltip
                                  cursor={{fill: 'hsl(var(--muted))'}}
                                  content={<ChartTooltipContent />}
                              />
                              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                                {monthlyExpenses.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                              </BarChart>
                          </ResponsiveContainer>
                      </ChartContainer>
                  </div>
              </TabsContent>
              <TabsContent value="pie">
                  <div className="h-[300px]">
                       <ChartContainer config={chartConfig}>
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <ChartTooltip 
                                      cursor={{fill: 'hsl(var(--muted))'}}
                                      content={<ChartTooltipContent nameKey="name" />}
                                  />
                                  <Pie
                                      data={monthlyExpenses}
                                      dataKey="total"
                                      nameKey="name"
                                      cx="50%"
                                      cy="50%"
                                      outerRadius={100}
                                      labelLine={false}
                                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                  >
                                      {monthlyExpenses.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.fill} />
                                      ))}
                                  </Pie>
                              </PieChart>
                          </ResponsiveContainer>
                      </ChartContainer>
                  </div>
              </TabsContent>
          </Tabs>
        ) : (
          <div className="flex h-[340px] flex-col items-center justify-center text-center">
            <p className="text-muted-foreground">No hay gastos registrados este mes.</p>
            <p className="text-sm text-muted-foreground">Añade una transacción de gasto para ver tu análisis.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
