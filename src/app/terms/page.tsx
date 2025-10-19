import Link from "next/link";
import { EykarLogo } from "@/components/icons/eykar-logo";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 w-full max-w-5xl py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <EykarLogo className="w-8 h-8 text-primary" />
          <span className="font-headline">Flinzly</span>
        </Link>
      </header>
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 w-full max-w-3xl">
          <div className="prose dark:prose-invert max-w-none">
            <h1 className="text-3xl font-headline mb-6">Términos de Servicio</h1>
            <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2 className="text-2xl font-headline mt-8 mb-4">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar Flinzly (el "Servicio"), usted acepta estar sujeto a estos Términos de Servicio ("Términos"). Si no está de acuerdo con alguno de los términos, no podrá utilizar el Servicio.
            </p>

            <h2 className="text-2xl font-headline mt-8 mb-4">2. Descripción del Servicio</h2>
            <p>
              Flinzly es una aplicación de finanzas personales que ayuda a los usuarios a realizar un seguimiento de sus ingresos y gastos, establecer metas de ahorro y obtener información sobre sus hábitos financieros.
            </p>

            <h2 className="text-2xl font-headline mt-8 mb-4">3. Cuentas de Usuario</h2>
            <p>
              Para utilizar la mayoría de las funciones del Servicio, debe registrarse para obtener una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.
            </p>

            <h2 className="text-2xl font-headline mt-8 mb-4">4. Suscripciones</h2>
            <p>
              Algunas partes del Servicio están disponibles solo con una suscripción de pago. Las tarifas de suscripción se facturarán de forma recurrente. Puede cancelar su suscripción en cualquier momento.
            </p>

            <h2 className="text-2xl font-headline mt-8 mb-4">5. Terminación</h2>
            <p>
              Podemos suspender o cancelar su acceso al Servicio de inmediato, sin previo aviso ni responsabilidad, por cualquier motivo, incluido el incumplimiento de los Términos.
            </p>

            <h2 className="text-2xl font-headline mt-8 mb-4">6. Limitación de Responsabilidad</h2>
            <p>
              En ningún caso Flinzly será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo que surja de su uso del Servicio.
            </p>

            <h2 className="text-2xl font-headline mt-8 mb-4">7. Cambios en los Términos</h2>
            <p>
              Nos reservamos el derecho de modificar o reemplazar estos Términos en cualquier momento. Le notificaremos cualquier cambio publicando los nuevos Términos en esta página.
            </p>
            
            <h2 className="text-2xl font-headline mt-8 mb-4">8. Contáctenos</h2>
            <p>
              Si tiene alguna pregunta sobre estos Términos, contáctenos en <a href="mailto:soporte@flinzly.com" className="text-primary hover:underline">soporte@flinzly.com</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}