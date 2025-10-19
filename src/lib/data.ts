import React from 'react';
import type { Icon as LucideIcon } from 'lucide-react';
import { ShoppingCart, Car, Home, Popcorn, HeartPulse, GraduationCap, Gift, Landmark, PiggyBank, Briefcase } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  type: 'income' | 'expense';
  color: string;
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
  category: Category;
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
