"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/toaster";
import { type Wallet, type Transaction, type Category } from "@/contexts/data-context";
import { useSettings } from "@/contexts/settings-context";

interface AddTransactionDialogProps {
  onTransactionAdded: (transaction: Omit<Transaction, 'id' | 'date' | 'userId'>) => void;
  wallets: Wallet[];
  categories: Category[];
}

export function AddTransactionDialog({ onTransactionAdded, wallets, categories }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { formatCurrency } = useSettings();

  const hasWallets = wallets.length > 0;
  const hasCategories = categories.length > 0;

  const transactionFormSchema = z.object({
    description: z.string().min(2, { message: "La descripción debe tener al menos 2 caracteres." }),
    amount: z.coerce.number().positive({ message: "El monto debe ser mayor a cero." }),
    type: z.enum(["expense", "income"], { required_error: "Debes seleccionar un tipo." }),
    categoryId: hasCategories
      ? z.string({ required_error: "Debes seleccionar una categoría." })
      : z.string().refine(() => false, { message: "Primero debe crear una categoría." }),
    walletId: hasWallets
      ? z.string({ required_error: "Debes seleccionar una billetera." })
      : z.string().refine(() => false, { message: "Primero debe crear una billetera." }),
  });

  type TransactionFormValues = z.infer<typeof transactionFormSchema>;
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: "expense",
    },
  });

  const transactionType = form.watch("type");
  const filteredCategories = categories.filter(c => c.type === transactionType);

  function onSubmit(data: TransactionFormValues) {
    onTransactionAdded(data as any);
    toast({
      title: "¡Transacción guardada!",
      description: `Se ha guardado tu ${data.type === 'expense' ? 'gasto' : 'ingreso'}.`,
    });
    setOpen(false);
    form.reset();
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Transacción
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nueva Transacción</DialogTitle>
          <DialogDescription>
            Registra un nuevo ingreso o gasto. Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>
         <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
             <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('categoryId', ''); // Reset category on type change
                      }}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel className="font-normal">Gasto</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="income" />
                        </FormControl>
                        <FormLabel className="font-normal">Ingreso</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Compra en el supermercado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!hasCategories || filteredCategories.length === 0}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={!hasCategories ? "Crea una categoría primero" : "Selecciona una categoría"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                   </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="walletId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billetera</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!hasWallets}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={!hasWallets ? "Crea una billetera primero" : "Selecciona una billetera"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wallets.map(wallet => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          {wallet.name} ({formatCurrency(wallet.balance)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                   </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit">Guardar Transacción</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
