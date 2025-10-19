'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc, useUser } from '@/firebase';

// Define the shape of your settings
interface AppSettings {
  currency: string;
}

// Define the context shape
interface SettingsContextType {
  settings: AppSettings;
  setSettings: (settings: Partial<AppSettings>) => void;
  formatCurrency: (amount: number) => string;
  isSettingsLoading: boolean;
}

// Create the context with a default value
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

// Create a provider component
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<AppSettings>({
    currency: 'USD', // Default currency
  });
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileDocRef =
    user && firestore ? doc(firestore, `users/${user.uid}`) : null;

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileDocRef);

  useEffect(() => {
    if (userProfile && userProfile.currency) {
      setSettingsState(prev => ({ ...prev, currency: userProfile.currency }));
    }
  }, [userProfile]);

  const setSettings = (newSettings: Partial<AppSettings>) => {
    // In a real app, you'd persist this to the user's profile in Firestore
    setSettingsState(prevSettings => ({ ...prevSettings, ...newSettings }));
  };

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: settings.currency,
      }).format(amount);
    } catch (e) {
      // Fallback for invalid currency
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }
  };

  const value = {
    settings,
    setSettings,
    formatCurrency,
    isSettingsLoading: isProfileLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Create a custom hook to use the settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
