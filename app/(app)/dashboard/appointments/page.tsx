import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { mockAppointments } from "@/lib/mock-data";

export default function AppointmentsPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-200">Agenda</p>
          <h1 className="text-3xl font-semibold text-white">Turnos programados</h1>
        </div>
        <Link href="/appointments/new" className={buttonVariants()}>
          Crear turno manual
        </Link>
      </header>

      <Card>
        <CardHeader
          title="Resumen del día"
          description="Filtra y gestiona los turnos activos, confirmados y pendientes de la jornada."
        />
        <CardContent>
          <div className="space-y-4">
            {mockAppointments.map((appointment) => (
              <article
                key={appointment.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm text-brand-200">{appointment.id}</p>
                  <p className="text-lg font-semibold text-white">{appointment.driver}</p>
                  <p className="text-xs text-slate-400">Placa {appointment.plate}</p>
                </div>
                <div className="text-sm text-slate-300">
                  <p>{appointment.dock}</p>
                  <p>
                    {new Date(appointment.scheduledAt).toLocaleTimeString("es-CO", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    {appointment.status}
                  </span>
                  <span className="text-xs text-slate-400">Tolerancia {appointment.toleranceMinutes} min</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <button className={buttonVariants({ variant: "ghost", size: "sm" })}>Reenviar confirmación</button>
                  <button className={buttonVariants({ variant: "secondary", size: "sm" })}>Liberar muelle</button>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
