"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-semibold text-white">Algo salió mal; intentemos otra vez.</h1>
      <p className="max-w-md text-sm text-slate-300">
        Ocurrió un error inesperado al cargar la vista. Puedes reintentar la operación o volver al inicio para navegar por
        otra sección.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" className={buttonVariants()} onClick={reset}>
          Reintentar
        </button>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
