'use client';

import { Wallet as WalletIcon, Trash2 } from 'lucide-react';
import { type Wallet } from '@/contexts/data-context';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toaster';
import { useSettings } from '@/contexts/settings-context';

interface WalletsListProps {
  wallets: Wallet[];
  onDeleteWallet: (walletId: string) => void;
}

export function WalletsList({ wallets, onDeleteWallet }: WalletsListProps) {
  const { toast } = useToast();
  const { formatCurrency } = useSettings();

  const handleDelete = (walletId: string) => {
    onDeleteWallet(walletId);
    toast({
      title: 'Billetera eliminada',
      description: 'La billetera ha sido eliminada correctamente.',
    });
  };

  if (wallets.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-16">
        <div className="flex flex-col items-center gap-1 text-center">
          <WalletIcon className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-2xl font-bold tracking-tight">
            No tienes billeteras
          </h3>
          <p className="text-sm text-muted-foreground">
            Crea tu primera billetera para empezar a organizar tus finanzas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {wallets.map(wallet => (
        <Card key={wallet.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <WalletIcon className="h-5 w-5 text-primary" />
              {wallet.name}
            </CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar billetera</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará
                    permanentemente la billetera "{wallet.name}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(wallet.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(wallet.balance)}
            </div>
            <p className="text-xs text-muted-foreground">Balance actual</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
