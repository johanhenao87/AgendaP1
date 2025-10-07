"use client";

import { useState } from "react";
import { useToast } from "@/components/providers";
import { StateBadge } from "@/components/ui/state-badge";
import type { DockAssignment, DockSlot } from "@/lib/mock-data";

type Props = {
  assignments: DockAssignment[];
  slots: DockSlot[];
};

export function AssignmentBoard({ assignments, slots }: Props) {
  const { notify } = useToast();
  const [state, setState] = useState(assignments);
  const [autoSavedAt, setAutoSavedAt] = useState<Date | null>(null);

  function onDrop(appointmentId: string, slotId: string) {
    const slot = slots.find((item) => item.id === slotId);
    if (!slot || slot.blocked) {
      notify({ title: "Muelle ocupado", description: "Selecciona un muelle disponible", variant: "error" });
      return;
    }

    const existingAssignment = state.find((item) => item.slotId === slotId && item.id !== appointmentId);
    if (existingAssignment) {
      notify({ title: "Conflicto de horarios", description: "El muelle ya tiene un turno asignado", variant: "error" });
      return;
    }

    setState((current) =>
      current.map((item) => (item.id === appointmentId ? { ...item, slotId } : item))
    );
    setAutoSavedAt(new Date());
    notify({ title: "Guardado", description: "Asignación actualizada", variant: "success" });
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Asignación de muelles</h2>
        {autoSavedAt ? (
          <p className="flex items-center gap-2 text-xs text-emerald-300">
            <span role="img" aria-label="guardado">
              ✅
            </span>
            Guardado automático {autoSavedAt.toLocaleTimeString()}
          </p>
        ) : null}
      </header>
      <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-3">
          {state.map((assignment) => {
            const slot = slots.find((item) => item.id === assignment.slotId);
            return (
              <div
                key={assignment.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("appointment", assignment.id);
                }}
              >
                <div>
                  <p className="text-sm text-brand-200">{assignment.id}</p>
                  <p className="text-lg font-semibold text-white">{assignment.driver}</p>
                  <p className="text-xs text-slate-400">{slot?.label ?? "Sin asignar"}</p>
                </div>
                <StateBadge state={assignment.status} />
              </div>
            );
          })}
        </div>
        <div className="space-y-3">
          {slots.map((slot) => {
            const assigned = state.find((item) => item.slotId === slot.id);
            return (
              <div
                key={slot.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const appointmentId = event.dataTransfer.getData("appointment");
                  onDrop(appointmentId, slot.id);
                }}
                className={`rounded-2xl border p-4 transition ${
                  slot.blocked
                    ? "border-red-500/60 bg-red-500/10 text-red-200"
                    : "border-white/10 bg-white/5 text-slate-200 hover:border-brand-400 hover:bg-brand-500/10"
                }`}
              >
                <p className="text-sm font-semibold">{slot.label}</p>
                <p className="text-xs text-slate-400">Ventana {slot.hour}</p>
                <p className="mt-2 text-xs text-slate-300">
                  {assigned ? `Asignado a ${assigned.driver}` : slot.blocked ? "Mantenimiento" : "Disponible"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
