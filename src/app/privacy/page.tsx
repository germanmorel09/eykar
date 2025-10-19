import Link from "next/link";
import { EykarLogo } from "@/components/icons/eykar-logo";

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-headline mb-6">Política de Privacidad</h1>
            <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <h2 className="text-2xl font-headline mt-8 mb-4">1. Introducción</h2>
            <p>
              Bienvenido a Flinzly. Respetamos su privacidad y nos comprometemos a proteger su información personal. Esta Política de Privacidad explicará cómo nuestra organización utiliza los datos personales que recopilamos de usted cuando utiliza nuestro sitio web y aplicación.
            </p>

            <h2 className="text-2xl font-headline mt-8 mb-4">2. ¿Qué datos recopilamos?</h2>
            <p>
              Flinzly recopila los siguientes datos:
            </p>
            <ul className="list-disc pl-6">
              <li>Información de identificación personal (nombre, dirección de correo electrónico, etc.).</li>
              <li>Datos financieros que usted proporciona (transacciones, saldos de billeteras, metas de ahorro).</li>
              <li>Datos de uso del sitio web (cookies y datos de navegación).</li>
            </ul>

            <h2 className="text-2xl font-headline mt-8 mb-4">3. ¿Cómo recopilamos sus datos?</h2>
            <p>
              Usted proporciona directamente a Flinzly la mayoría de los datos que recopilamos. Recopilamos datos y procesamos datos cuando usted:
            </p>
            <ul className="list-disc pl-6">
              <li>Se registra en línea o realiza un pedido de cualquiera de nuestros productos o servicios.</li>
              <li>Utiliza o ve nuestro sitio web a través de las cookies de su navegador.</li>
              <li>Ingresa voluntariamente datos financieros en la aplicación.</li>
            </ul>

            <h2 className="text-2xl font-headline mt-8 mb-4">4. ¿Cómo usaremos sus datos?</h2>
            <p>
              Flinzly recopila sus datos para que podamos:
            </p>
            <ul className="list-disc pl-6">
              <li>Procesar su pedido y administrar su cuenta.</li>
              <li>Proporcionarle las funciones de la aplicación, como el seguimiento de gastos y ahorros.</li>
              <li>Generar consejos financieros personalizados utilizando modelos de IA.</li>
              <li>Enviarle por correo electrónico ofertas especiales sobre otros productos y servicios que creemos que le pueden gustar.</li>
            </ul>

            <h2 className="text-2xl font-headline mt-8 mb-4">5. ¿Cómo almacenamos sus datos?</h2>
            <p>
              Flinzly almacena de forma segura sus datos en los servidores de Firebase de Google Cloud. Mantenemos sus datos seguros mediante reglas de seguridad estrictas y cifrado de datos.
            </p>

            <h2 className="text-2xl font-headline mt-8 mb-4">6. Cookies</h2>
            <p>
              Las cookies son archivos de texto que se colocan en su computadora para recopilar información estándar de registro de Internet e información sobre el comportamiento de los visitantes. Cuando visita nuestros sitios web, podemos recopilar información de usted automáticamente a través de cookies o tecnología similar.
            </p>
            
            <h2 className="text-2xl font-headline mt-8 mb-4">7. Cambios a nuestra política de privacidad</h2>
            <p>
              Flinzly mantiene su política de privacidad bajo revisión periódica y coloca cualquier actualización en esta página web.
            </p>

            <h2 className="text-2xl font-headline mt-8 mb-4">8. Cómo contactarnos</h2>
            <p>
              Si tiene alguna pregunta sobre la política de privacidad de Flinzly, los datos que tenemos sobre usted, o si desea ejercer uno de sus derechos de protección de datos, no dude en contactarnos en <a href="mailto:privacidad@flinzly.com" className="text-primary hover:underline">privacidad@flinzly.com</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}