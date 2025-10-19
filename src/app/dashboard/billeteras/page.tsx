"use client";

import { useData } from "@/contexts/data-context";
import { WalletsList } from "@/components/dashboard/wallets-list";
import { AddWalletDialog } from "@/components/dashboard/add-wallet-dialog";

export default function BilleterasPage() {
    const { wallets, addWallet, deleteWallet, isDataLoading } = useData();

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight font-headline">Tus Billeteras</h2>
                    <p className="text-muted-foreground">Gestiona tus cuentas de efectivo, banco y tarjetas.</p>
                </div>
                <AddWalletDialog onWalletAdded={addWallet} />
            </div>
            <WalletsList wallets={wallets} onDeleteWallet={deleteWallet} />
        </main>
    );
}
