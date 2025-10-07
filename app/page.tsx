import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { mockKpis, mockRules } from "@/lib/mock-data";

const highlights = [
  {
    title: "Agenda inteligente",
    description:
      "Configura franjas horarias dinámicas, reglas por tipo de carga y validaciones automáticas antes del check-in.",
    cta: { label: "Simula capacidad", href: "/dashboard/kpis" }
  },
  {
    title: "Operación en tiempo real",
    description:
      "Visualiza los muelles ocupados, reasigna turnos con drag & drop y comunica al instante los cambios al conductor.",
    cta: { label: "Ver panel", href: "/dashboard" }
  },
  {
    title: "Analítica operativa",
    description:
      "Mide SLA, ocupación y cuellos de botella para planificar con datos y anticiparte a los picos de demanda.",
    cta: { label: "KPIs", href: "/dashboard/kpis" }
  }
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-16">
      <section className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-wide text-brand-200">
            Gestión integral de turnos
          </span>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            Coordina tu planta con precisión minuto a minuto
          </h1>
          <p className="text-lg text-slate-300">
            Centraliza la programación de citas, controla la asignación de muelles y anticipa la demanda con un motor
            de reglas configurable y KPIs accionables.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/appointments/new" className={buttonVariants()}>
              Crear turno demo
            </Link>
            <Link href="/dashboard" className={buttonVariants({ variant: "secondary" })}>
              Explorar panel
            </Link>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-5 text-sm text-slate-300">
            <p className="font-semibold text-white">¿Qué obtienes?</p>
            <ul className="mt-3 space-y-2">
              <li>✔️ Validación de documentos y tolerancias configurables.</li>
              <li>✔️ Reglas dinámicas por tipo de carga, muelle o cliente.</li>
              <li>✔️ Notificaciones omnicanal y seguimiento post-cita.</li>
            </ul>
          </div>
        </div>
        <div className="space-y-4 rounded-3xl border border-brand-500/40 bg-gradient-to-br from-brand-500/20 via-slate-900 to-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">KPIs destacados</h2>
          <div className="space-y-3">
            {mockKpis.map((kpi) => (
              <div key={kpi.label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm text-slate-300">{kpi.label}</p>
                <p className="text-3xl font-bold text-white">{kpi.value}</p>
                <p className="text-xs text-brand-200">{kpi.trend}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title}>
            <CardHeader title={item.title} />
            <CardContent>
              <p>{item.description}</p>
              <Link href={item.cta.href} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                {item.cta.label}
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white">Reglas activas</h2>
          <p className="text-sm text-slate-300">
            Configuraciones claves que garantizan el flujo operativo y el cumplimiento de tolerancias.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {mockRules.map((rule) => (
            <Card key={rule.name} className="bg-white/8">
              <CardHeader title={rule.name} description={rule.description} />
              <CardContent>
                <p className="text-xs text-slate-400">Última edición: {rule.lastUpdatedBy}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
