"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/toaster";
import { Goal, Wallet } from "@/contexts/data-context";
import { useSettings } from "@/contexts/settings-context";

const contributionFormSchema = z.object({
  amount: z.coerce.number().positive({ message: "El monto debe ser mayor a cero." }),
  type: z.enum(["deposit", "withdraw"], { required_error: "Debes seleccionar un tipo." }),
  walletId: z.string({ required_error: "Debes seleccionar una billetera." }),
});

type ContributionFormValues = z.infer<typeof contributionFormSchema>;

interface ManageGoalContributionDialogProps {
    goal: Goal;
    wallets: Wallet[];
    onContribute: (goalId: string, amount: number, walletId: string, type: 'deposit' | 'withdraw') => void;
}

export function ManageGoalContributionDialog({ goal, wallets, onContribute }: ManageGoalContributionDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { formatCurrency } = useSettings();

  const form = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      amount: 0,
      type: "deposit",
    },
  });

  function onSubmit(data: ContributionFormValues) {
    if (data.type === 'withdraw' && data.amount > goal.currentAmount) {
        toast({
            variant: "destructive",
            title: "Monto inválido",
            description: "No puedes retirar más de lo que has ahorrado en esta meta.",
        });
        return;
    }
    
    onContribute(goal.id, data.amount, data.walletId, data.type);
    
    toast({
      title: "¡Operación exitosa!",
      description: `Has ${data.type === 'deposit' ? 'abonado' : 'retirado'} ${formatCurrency(data.amount)} a tu meta "${goal.name}".`,
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
            <Edit className="h-3 w-3 mr-1" />
            Gestionar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gestionar Meta: {goal.name}</DialogTitle>
          <DialogDescription>
            Abona o retira dinero de tu meta de ahorro.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Operación</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="deposit" />
                        </FormControl>
                        <FormLabel className="font-normal">Abonar</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="withdraw" />
                        </FormControl>
                        <FormLabel className="font-normal">Quitar</FormLabel>
                      </FormItem>
                    </RadioGroup>
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
                    <Input type="number" placeholder="50.00" {...field} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una billetera" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wallets.map((wallet) => (
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
              <Button type="submit">Confirmar Operación</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
