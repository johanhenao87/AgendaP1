"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StateBadge } from "@/components/ui/state-badge";
import { useLanguage, useToast } from "@/components/providers";
import { mockAppointments } from "@/lib/mock-data";
import { formatHour, remainingTolerance } from "@/lib/utils";

export default function AppointmentsPage() {
  const { notify } = useToast();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const appointment = useMemo(() => mockAppointments.find((item) => item.id === selected), [selected]);
  const remaining = appointment ? remainingTolerance(appointment.scheduledAt, appointment.toleranceMinutes) : null;

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
                  <p>{formatHour(appointment.scheduledAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StateBadge state={appointment.status} />
                  <span className="text-xs text-slate-400">Tolerancia {appointment.toleranceMinutes} min</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <button
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                    onClick={() =>
                      notify({
                        title: "Confirmación reenviada",
                        description: `Se notificó nuevamente a ${appointment.driver}`,
                        variant: "success"
                      })
                    }
                  >
                    Reenviar confirmación
                  </button>
                  <button
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                    onClick={() => setSelected(appointment.id)}
                  >
                    Cancelar turno
                  </button>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(selected)}
        title={appointment ? `Cancelar ${appointment.id}` : "Cancelar turno"}
        description={
          appointment ? (
            <div className="space-y-2">
              <p>
                {remaining !== null && remaining > 0
                  ? t.messages.cancellationAllowed(remaining)
                  : t.messages.cancellationBlocked}
              </p>
              <p className="text-xs text-slate-400">
                Última ventana de tolerancia: {formatHour(appointment.scheduledAt)} + {appointment.toleranceMinutes} min.
              </p>
            </div>
          ) : null
        }
        confirmLabel={t.actions.cancel}
        cancelLabel={t.actions.tryAgain}
        onConfirm={() => {
          if (remaining !== null && remaining <= 0) {
            notify({ title: "No permitido", description: t.messages.cancellationBlocked, variant: "error" });
          } else {
            notify({ title: "Turno cancelado", description: "Se liberó el cupo", variant: "success" });
          }
        }}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
