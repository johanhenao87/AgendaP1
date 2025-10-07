import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { mockAppointments } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-200">Operación en vivo</p>
        <h1 className="text-3xl font-semibold text-white">Panel de planta</h1>
        <p className="text-sm text-slate-300">
          Visualiza las citas del día, tolerancias y estados operativos para tomar decisiones inmediatas.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader title="Turnos activos" description="En proceso dentro de planta" />
          <CardContent>
            <p className="text-4xl font-semibold text-white">6</p>
            <p className="text-xs text-slate-400">2 en muelle prioritario</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Capacidad restante" description="Cupos disponibles en la jornada" />
          <CardContent>
            <p className="text-4xl font-semibold text-white">12</p>
            <p className="text-xs text-slate-400">Actualizar reglas si baja de 8</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Alertas" description="Eventos que requieren seguimiento" />
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>⚠️ Llegada tardía — TUR-24005</li>
              <li>ℹ️ Documento SOAT por vencer</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Turnos del día</h2>
          <p className="text-xs text-slate-400">Datos simulados a modo demostrativo</p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Turno</th>
                <th className="px-4 py-3">Conductor</th>
                <th className="px-4 py-3">Placa</th>
                <th className="px-4 py-3">Muelle</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Horario</th>
                <th className="px-4 py-3">Tolerancia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/60">
              {mockAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-4 py-3 font-medium text-white">{appointment.id}</td>
                  <td className="px-4 py-3">{appointment.driver}</td>
                  <td className="px-4 py-3">{appointment.plate}</td>
                  <td className="px-4 py-3">{appointment.dock}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(appointment.scheduledAt).toLocaleTimeString("es-CO", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>
                  <td className="px-4 py-3">{appointment.toleranceMinutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
