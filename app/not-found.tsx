import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-semibold text-white">Ruta no encontrada 🧭</h1>
      <p className="max-w-md text-sm text-slate-300">
        La página que buscabas no existe o cambió de ubicación. Revisa la URL o regresa al inicio para continuar navegando.
      </p>
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        Volver al inicio
      </Link>
    </div>
  );
}
