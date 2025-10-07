import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { AssignmentBoard } from "@/components/dashboard/assignment-board";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";
import { dockAssignments, dockSlots, mockAppointments, notificationLogs } from "@/lib/mock-data";

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
        <AppointmentsTable appointments={mockAppointments} />
      </section>

      <AssignmentBoard assignments={dockAssignments} slots={dockSlots} />

      <NotificationsPanel logs={notificationLogs} />
    </div>
  );
}
