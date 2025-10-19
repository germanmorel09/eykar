"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, BarChart2, Target, Shapes } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/billeteras", label: "Billeteras", icon: Wallet },
  { href: "/dashboard/categorias", label: "Categorías", icon: Shapes },
  { href: "/dashboard/objetivos", label: "Metas", icon: Target },
  { href: "/dashboard/analisis", label: "Análisis", icon: BarChart2 },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background">
      <nav className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
