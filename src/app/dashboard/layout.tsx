'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/app/dashboard/header';
import { MobileBottomNav } from '@/components/dashboard/mobile-bottom-nav';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
