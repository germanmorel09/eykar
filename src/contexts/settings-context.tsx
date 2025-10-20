'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { createClient } from '@supabase/supabase-js';

// ✅ Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos
interface AppSettings {
  currency: string;
}

interface SettingsContextType {
  settings: AppSettings;
  setSettings: (settings: Partial<AppSettings>) => void;
  formatCurrency: (amount: number) => string;
  isSettingsLoading: boolean;
}

// Crear contexto
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<AppSettings>({
    currency: 'USD',
  });
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Cargar configuración desde localStorage o Supabase
  useEffect(() => {
    const loadSettings = async () => {
      // 1️⃣ Intentar desde localStorage
      const savedCurrency = localStorage.getItem('currency');
      if (savedCurrency) {
        setSettingsState({ currency: savedCurrency });
        setIsLoading(false);
        return;
      }

      // 2️⃣ (Opcional) Cargar desde Supabase si el usuario está logueado
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('currency')
          .eq('id', userData.user.id)
          .single();
        if (!error && data?.currency) {
          setSettingsState({ currency: data.currency });
          localStorage.setItem('currency', data.currency);
        }
      }

      setIsLoading(false);
    };

    loadSettings();
  }, []);

  // 🔹 Actualizar configuración (local + Supabase)
  const setSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettingsState(updated);

    if (newSettings.currency) {
      localStorage.setItem('currency', newSettings.currency);
    }

    // Guardar también en Supabase si el usuario está logueado
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      await supabase
        .from('users')
        .upsert({
          id: userData.user.id,
          currency: updated.currency,
        });
    }
  };

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: settings.currency,
      }).format(amount);
    } catch {
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
    isSettingsLoading: isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Hook para usar el contexto
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
