import Link from "next/link";
import { EykarLogo } from "@/components/icons/eykar-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
       <div className="absolute top-8 left-8">
         <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <EykarLogo className="w-8 h-8 text-primary" />
          <span className="font-headline">Flinzly</span>
        </Link>
      </div>
      {children}
    </div>
  );
}

    