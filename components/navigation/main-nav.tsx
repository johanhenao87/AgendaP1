import Link from "next/link";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/appointments/new", label: "Agenda un turno" },
  { href: "/dashboard", label: "Panel" },
  { href: "/dashboard/kpis", label: "KPIs" }
];

export function MainNav() {
  return (
    <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold">
            AP1
          </span>
          Agendamiento Planta 1
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-300 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/appointments/new"
            className="rounded-full bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400"
          >
            Crear turno
          </Link>
        </div>
      </div>
    </header>
  );
}
