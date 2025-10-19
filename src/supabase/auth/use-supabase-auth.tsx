"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const s = supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  return { session };
}

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ?? null);
      setIsUserLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setIsUserLoading(false);
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  return { user, isUserLoading };
}
