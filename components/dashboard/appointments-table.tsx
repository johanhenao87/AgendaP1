"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/providers";
import { Skeleton } from "@/components/ui/skeleton";
import { StateBadge } from "@/components/ui/state-badge";
import { formatHour } from "@/lib/utils";
import type { Appointment } from "@/lib/mock-data";

type Props = {
  appointments: Appointment[];
};

export function AppointmentsTable({ appointments }: Props) {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [showEmpty, setShowEmpty] = useState(false);
  const [data, setData] = useState<Appointment[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(appointments);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [appointments]);

  const items = showEmpty ? [] : data;

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-white/15 bg-white/5 px-8 py-16 text-center text-sm text-slate-300">
        <p className="text-lg font-semibold text-white">No tienes turnos programados</p>
        <p>Puedes crear un turno manual para comenzar a recibir reservaciones.</p>
        <button
          type="button"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => notify({ title: "Acción", description: "Simulando creación de turno", variant: "success" })}
        >
          Crear turno
        </button>
        <button
          type="button"
          className="text-xs text-slate-400 underline"
          onClick={() => setShowEmpty(false)}
        >
          Volver a la tabla
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <label htmlFor="empty-toggle">Estados vacíos</label>
          <input
            id="empty-toggle"
            type="checkbox"
            checked={showEmpty}
            onChange={(event) => setShowEmpty(event.target.checked)}
          />
        </div>
        <button
          type="button"
          className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
          onClick={() => notify({ title: "Reenviar", description: "Confirmaciones reenviadas", variant: "success" })}
        >
          Reenviar confirmación a todos
        </button>
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
            {items.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-4 py-3 font-medium text-white">{appointment.id}</td>
                <td className="px-4 py-3">{appointment.driver}</td>
                <td className="px-4 py-3">{appointment.plate}</td>
                <td className="px-4 py-3">{appointment.dock}</td>
                <td className="px-4 py-3">
                  <StateBadge state={appointment.status} />
                </td>
                <td className="px-4 py-3">{formatHour(appointment.scheduledAt)}</td>
                <td className="px-4 py-3">{appointment.toleranceMinutes} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
