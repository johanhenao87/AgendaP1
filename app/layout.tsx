import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { MainNav } from "@/components/navigation/main-nav";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Agendamiento Planta 1",
  description:
    "Plataforma integral para gestionar turnos, reglas y analítica operativa en planta.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <MainNav />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-white/10 bg-slate-900/60 backdrop-blur">
              <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
                <p>© {new Date().getFullYear()} Agendamiento Planta 1. Todos los derechos reservados.</p>
                <p className="text-xs text-slate-500">
                  Documentación técnica disponible en la carpeta <code>/docs</code> del repositorio.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
