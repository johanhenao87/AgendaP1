"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLanguage } from "@/components/providers";

const links = [
  { href: "/", key: "home" as const },
  { href: "/appointments/new", key: "newAppointment" as const },
  { href: "/dashboard", key: "dashboard" as const },
  { href: "/dashboard/kpis", key: "kpis" as const }
];

export function MainNav() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-white/10 bg-slate-900/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold">AP1</span>
          Agendamiento Planta 1
        </Link>
        <button
          type="button"
          className="md:hidden"
          aria-label="Abrir navegación"
          onClick={() => setOpen((value) => !value)}
        >
          ☰
        </button>
        <nav
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 top-16 w-full flex-col gap-4 border-b border-white/10 bg-slate-950/95 px-6 py-4 text-sm font-medium text-slate-300 md:static md:flex md:flex-row md:items-center md:justify-center md:border-none md:bg-transparent md:py-0`}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1 transition-colors hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {t.navigation[link.key]}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <LanguageToggle />
          <Link href="/appointments/new" className={buttonVariants({ size: "sm" })}>
            {t.actions.createTurn}
          </Link>
        </div>
      </div>
      {open ? (
        <div className="flex items-center justify-between gap-3 px-6 pb-4 md:hidden">
          <ThemeToggle />
          <LanguageToggle />
          <Link href="/appointments/new" className={buttonVariants({ size: "sm" })}>
            {t.actions.createTurn}
          </Link>
        </div>
      ) : null}
    </header>
  );
}
