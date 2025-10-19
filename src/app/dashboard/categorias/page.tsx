'use client';

import { useData, type Category } from '@/contexts/data-context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { AddCategoryDialog } from '@/components/dashboard/add-category-dialog';
import { useToast } from '@/components/ui/toaster';


export default function CategoriasPage() {
  const { categories, addCategory, deleteCategory } = useData();
  const { toast } = useToast();

  const handleDelete = (category: Category) => {
    deleteCategory(category.id);
    toast({
      title: 'Categoría eliminada',
      description: `La categoría "${category.name}" ha sido eliminada.`,
    });
  };

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-headline">
            Categorías
          </h2>
          <p className="text-muted-foreground">
            Crea y gestiona las categorías para tus transacciones.
          </p>
        </div>
        <AddCategoryDialog onCategoryAdded={addCategory} />
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Categorías de Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryTable categories={incomeCategories} onDelete={handleDelete} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Categorías de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryTable categories={expenseCategories} onDelete={handleDelete} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

interface CategoryTableProps {
  categories: Category[];
  onDelete: (category: Category) => void;
}

function CategoryTable({ categories, onDelete }: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No hay categorías de este tipo.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map(category => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">
                <Badge variant="outline" style={{borderColor: category.color, color: category.color}}>
                    {category.name}
                </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(category)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
