'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import type { Icon as LucideIcon } from 'lucide-react';
import { 
    ShoppingCart, Landmark, PiggyBank, Car, Home, Popcorn, HeartPulse, 
    GraduationCap, Gift, Briefcase, MinusCircle, PlusCircle 
} from 'lucide-react';

import { supabase } from '@/supabase/client';
import { useSupabaseUser } from '@/supabase/auth/use-supabase-auth';
import { useToast } from '@/components/ui/toaster';

export interface Category {
  id: string;
  name: string;
  iconName: string;
  type: 'income' | 'expense';
  color: string;
  userId: string;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  userId: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  categoryId: string;
  walletId: string;
  userId: string;
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    userId: string;
}

interface DataContextType {
  transactions: Transaction[];
  goals: Goal[];
  wallets: Wallet[];
  categories: (Category & { icon: React.ComponentType<any> })[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'userId'>) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount' | 'userId'>) => void;
  addWallet: (wallet: Omit<Wallet, 'id' | 'userId'>) => void;
  deleteWallet: (walletId: string) => void;
  deleteGoal: (goalId: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'iconName' | 'color' | 'userId'>) => void;
  deleteCategory: (categoryId: string) => void;
  handleGoalContribution: (goalId: string, amount: number, walletId: string, type: 'deposit' | 'withdraw') => void;
  isDataLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const iconMap: { [key: string]: React.ComponentType<any> } = {
    ShoppingCart, Landmark, PiggyBank, Car, Home, Popcorn, HeartPulse,
    GraduationCap, Gift, Briefcase,
    default: MinusCircle
};


const categoryDefaults: { name: string; iconName: string; type: 'income' | 'expense'; color: string }[] = [
    { name: 'Salario', iconName: 'Briefcase', type: 'income', color: '#10B981' },
    { name: 'Otros Ingresos', iconName: 'PlusCircle', type: 'income', color: '#22C55E' },
    { name: 'Compras', iconName: 'ShoppingCart', type: 'expense', color: '#EF4444' },
    { name: 'Transporte', iconName: 'Car', type: 'expense', color: '#F97316' },
    { name: 'Hogar', iconName: 'Home', type: 'expense', color: '#3B82F6' },
    { name: 'Entretenimiento', iconName: 'Popcorn', type: 'expense', color: '#8B5CF6' },
    { name: 'Salud', iconName: 'HeartPulse', type: 'expense', color: '#EC4899' },
];

const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useSupabaseUser();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [rawCategories, setRawCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [isWalletsLoading, setIsWalletsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isGoalsLoading, setIsGoalsLoading] = useState(false);

  // On first sign in, if categories empty create defaults
  useEffect(() => {
    async function ensureDefaults() {
      if (!user) return;
      const { data } = await supabase
        .from('categories')
        .select('id')
        .eq('userId', user.id)
        .limit(1);
      if (data && data.length === 0) {
        const toInsert = categoryDefaults.map(cat => ({ ...cat, userId: user.id }));
        await supabase.from('categories').insert(toInsert);
      }
    }
    ensureDefaults();
  }, [user]);

  const categories = rawCategories.map(c => ({
      ...c,
      icon: iconMap[c.iconName] || MinusCircle
  }));

  // Fetch initial data and subscribe to realtime changes
  useEffect(() => {
    if (!user) return;

    setIsTransactionsLoading(true);
    setIsWalletsLoading(true);
    setIsCategoriesLoading(true);
    setIsGoalsLoading(true);

    // initial load
    (async () => {
      const [tRes, wRes, cRes, gRes] = await Promise.all([
        supabase.from('transactions').select('*').eq('userId', user.id).order('date', { ascending: false }),
        supabase.from('wallets').select('*').eq('userId', user.id),
        supabase.from('categories').select('*').eq('userId', user.id),
        supabase.from('goals').select('*').eq('userId', user.id),
      ]);

      if (tRes.error) console.error(tRes.error);
      else setTransactions(tRes.data ?? []);

      if (wRes.error) console.error(wRes.error);
      else setWallets(wRes.data ?? []);

      if (cRes.error) console.error(cRes.error);
      else setRawCategories(cRes.data ?? []);

      if (gRes.error) console.error(gRes.error);
      else setGoals(gRes.data ?? []);

      setIsTransactionsLoading(false);
      setIsWalletsLoading(false);
      setIsCategoriesLoading(false);
      setIsGoalsLoading(false);
    })();

    // realtime subscriptions
    const txChannel = supabase.channel('realtime-transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `userId=eq.${user.id}` }, (payload) => {
        const newRow = payload.new as Transaction | null;
        const oldRow = payload.old as Transaction | null;
        if (payload.eventType === 'INSERT' && newRow) {
          setTransactions(prev => [newRow, ...prev]);
        } else if (payload.eventType === 'UPDATE' && newRow) {
          setTransactions(prev => prev.map(p => p.id === newRow.id ? newRow : p));
        } else if (payload.eventType === 'DELETE' && oldRow) {
          setTransactions(prev => prev.filter(p => p.id !== oldRow.id));
        }
      }).subscribe();

    const wChannel = supabase.channel('realtime-wallets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets', filter: `userId=eq.${user.id}` }, (payload) => {
        const newRow = payload.new as Wallet | null;
        const oldRow = payload.old as Wallet | null;
        if (payload.eventType === 'INSERT' && newRow) {
          setWallets(prev => [newRow, ...prev]);
        } else if (payload.eventType === 'UPDATE' && newRow) {
          setWallets(prev => prev.map(p => p.id === newRow.id ? newRow : p));
        } else if (payload.eventType === 'DELETE' && oldRow) {
          setWallets(prev => prev.filter(p => p.id !== oldRow.id));
        }
      }).subscribe();

    const cChannel = supabase.channel('realtime-categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories', filter: `userId=eq.${user.id}` }, (payload) => {
        const newRow = payload.new as Category | null;
        const oldRow = payload.old as Category | null;
        if (payload.eventType === 'INSERT' && newRow) {
          setRawCategories(prev => [newRow, ...prev]);
        } else if (payload.eventType === 'UPDATE' && newRow) {
          setRawCategories(prev => prev.map(p => p.id === newRow.id ? newRow : p));
        } else if (payload.eventType === 'DELETE' && oldRow) {
          setRawCategories(prev => prev.filter(p => p.id !== oldRow.id));
        }
      }).subscribe();

    const gChannel = supabase.channel('realtime-goals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goals', filter: `userId=eq.${user.id}` }, (payload) => {
        const newRow = payload.new as Goal | null;
        const oldRow = payload.old as Goal | null;
        if (payload.eventType === 'INSERT' && newRow) {
          setGoals(prev => [newRow, ...prev]);
        } else if (payload.eventType === 'UPDATE' && newRow) {
          setGoals(prev => prev.map(p => p.id === newRow.id ? newRow : p));
        } else if (payload.eventType === 'DELETE' && oldRow) {
          setGoals(prev => prev.filter(p => p.id !== oldRow.id));
        }
      }).subscribe();

    return () => {
      supabase.removeChannel(txChannel);
      supabase.removeChannel(wChannel);
      supabase.removeChannel(cChannel);
      supabase.removeChannel(gChannel);
    };
  }, [user]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'date' | 'userId'>) => {
    if (!user) return;
    try {
      // get wallet
  const { data: wData, error: wError } = await supabase.from('wallets').select('*').eq('id', transaction.walletId).single();
      if (wError || !wData) throw new Error('La billetera no existe.');

      const currentBalance = wData.balance;
      const newBalance = transaction.type === 'income' ? currentBalance + transaction.amount : currentBalance - transaction.amount;
      if (newBalance < 0) throw new Error('Saldo insuficiente en la billetera.');

      // update wallet and insert transaction (not in a single DB transaction here)
      const { error: updErr } = await supabase.from('wallets').update({ balance: newBalance }).eq('id', transaction.walletId);
      if (updErr) throw updErr;

      const { error: insErr } = await supabase.from('transactions').insert([{ ...transaction, userId: user.id, date: new Date().toISOString() }]);
      if (insErr) throw insErr;
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error al añadir transacción', description: error.message });
    }
  }, [user, toast]);

  const addWallet = useCallback(async (wallet: Omit<Wallet, 'id' | 'userId'>) => {
    if (!user) return;
    await supabase.from('wallets').insert([{ ...wallet, userId: user.id }]);
  }, [user]);
  
  const deleteWallet = useCallback(async (walletId: string) => {
    if (!user) return;
    await supabase.from('wallets').delete().eq('id', walletId).eq('userId', user.id);
  }, [user, toast]);

  const addCategory = useCallback(async (category: Omit<Category, 'id' | 'iconName' | 'color' | 'userId'>) => {
    if (!user) return;
    await supabase.from('categories').insert([{ ...category, iconName: 'default', color: getRandomColor(), userId: user.id }]);
  }, [user]);

  const deleteCategory = useCallback(async (categoryId: string) => {
    if (!user) return;
    await supabase.from('categories').delete().eq('id', categoryId).eq('userId', user.id);
  }, [user]);

  const addGoal = useCallback(async (goal: Omit<Goal, 'id' | 'currentAmount' | 'userId'>) => {
    if (!user) return;
    await supabase.from('goals').insert([{ ...goal, currentAmount: 0, userId: user.id }]);
  }, [user]);

  const deleteGoal = useCallback(async (goalId: string) => {
    if (!user) return;
    await supabase.from('goals').delete().eq('id', goalId).eq('userId', user.id);
  }, [user]);

  const handleGoalContribution = useCallback(async (goalId: string, amount: number, walletId: string, type: 'deposit' | 'withdraw') => {
    if (!user) return;
    try {
      const [{ data: goalData, error: gErr }, { data: walletData, error: wErr }] = await Promise.all([
  supabase.from('goals').select('*').eq('id', goalId).single(),
  supabase.from('wallets').select('*').eq('id', walletId).single(),
      ]);
      if (gErr || !goalData) throw new Error('La meta no existe.');
      if (wErr || !walletData) throw new Error('La billetera no existe.');

      let newGoalAmount = goalData.currentAmount;
      let newWalletBalance = walletData.balance;

      if (type === 'deposit') {
        if (walletData.balance < amount) throw new Error('Saldo insuficiente en la billetera.');
        newGoalAmount += amount;
        newWalletBalance -= amount;
      } else {
        if (goalData.currentAmount < amount) throw new Error('Monto de retiro excede el ahorro actual de la meta.');
        newGoalAmount -= amount;
        newWalletBalance += amount;
      }

      await supabase.from('goals').update({ currentAmount: newGoalAmount }).eq('id', goalId);
      await supabase.from('wallets').update({ balance: newWalletBalance }).eq('id', walletId);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error en la operación', description: error.message });
    }
  }, [user, toast]);

  const isDataLoading = isTransactionsLoading || isWalletsLoading || isCategoriesLoading || isGoalsLoading;

  const value: DataContextType = {
    transactions,
    goals,
    wallets,
    categories,
    addTransaction,
    addGoal,
    addWallet,
    deleteWallet,
    deleteGoal,
    addCategory,
    deleteCategory,
    handleGoalContribution,
    isDataLoading: isUserLoading || isDataLoading,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
