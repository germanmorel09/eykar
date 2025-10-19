import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { PT_Sans as FontSans, Playfair_Display as FontHeadline } from "next/font/google"
import { SettingsProvider } from "@/contexts/settings-context";
import "./globals.css";
import { cn } from "@/lib/utils";
import { DataProvider } from "@/contexts/data-context";
import { FirebaseClientProvider } from "@/firebase/client-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "700"],
})

const fontHeadline = FontHeadline({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: "700"
})

export const metadata: Metadata = {
  title: "Flinzly",
  description: "Tu asistente financiero personal para tomar el control de tu dinero.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={cn("font-sans antialiased", fontSans.variable, fontHeadline.variable)}>
        <FirebaseClientProvider>
          <SettingsProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </SettingsProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}

    