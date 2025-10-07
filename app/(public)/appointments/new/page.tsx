"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";

const timeSlots = ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30"];
const docks = ["Muelle 1", "Muelle 2", "Muelle 3", "Muelle 4"];
const cargoTypes = ["General", "Refrigerado", "Peligroso", "Contenedor vacío"];

type Step = "details" | "confirmation";

export default function AppointmentFormPage() {
  const [step, setStep] = useState<Step>("details");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Agendamiento</p>
        <h1 className="text-3xl font-semibold text-white">Solicitar turno demo</h1>
        <p className="text-sm text-slate-300">
          Completa los datos del conductor y la carga para simular un turno. No se guardan datos reales, es un flujo de
          demostración.
        </p>
      </header>

      {step === "details" ? <DetailsStep onContinue={() => setStep("confirmation")} /> : null}
      {step === "confirmation" ? <ConfirmationStep onBack={() => setStep("details")} /> : null}
    </div>
  );
}

function DetailsStep({ onContinue }: { onContinue: () => void }) {
  return (
    <form
      className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/30"
      onSubmit={(event) => {
        event.preventDefault();
        onContinue();
      }}
    >
      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="plant">
            Planta
          </label>
          <select id="plant" name="plant" className="input">
            <option>Planta Norte</option>
            <option>Planta Centro</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="dock">
            Muelle preferido
          </label>
          <select id="dock" name="dock" className="input">
            {docks.map((dock) => (
              <option key={dock}>{dock}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="date">
            Fecha
          </label>
          <input id="date" name="date" type="date" className="input" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="time">
            Hora estimada de llegada
          </label>
          <select id="time" name="time" className="input">
            {timeSlots.map((slot) => (
              <option key={slot}>{slot}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="driverId">
            Cédula / Documento
          </label>
          <input id="driverId" name="driverId" type="text" className="input" placeholder="123456789" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="driverName">
            Nombre del conductor
          </label>
          <input id="driverName" name="driverName" type="text" className="input" placeholder="Juan Pérez" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="plate">
            Placa del vehículo
          </label>
          <input id="plate" name="plate" type="text" className="input" placeholder="ABC123" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-300" htmlFor="cargoType">
            Tipo de carga
          </label>
          <select id="cargoType" name="cargoType" className="input">
            {cargoTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-sm text-slate-200">Documentos requeridos</p>
        <div className="grid gap-3 md:grid-cols-2">
          <CheckboxItem label="Licencia de conducción vigente" />
          <CheckboxItem label="SOAT / Seguro obligatorio" />
          <CheckboxItem label="Certificado de fumigación" />
          <CheckboxItem label="Póliza de responsabilidad civil" />
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className={buttonVariants({ size: "lg" })}>
          Confirmar datos
        </button>
        <LinkButton href="/">Cancelar</LinkButton>
      </div>
    </form>
  );
}

function ConfirmationStep({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-8 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-8 text-slate-100">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">¡Turno demo confirmado!</h2>
        <p className="text-sm text-emerald-200">
          Simulamos el envío de un QR al conductor y la notificación a planta. Puedes regresar para ajustar los datos o
          explorar el panel administrativo.
        </p>
      </div>
      <div className="rounded-2xl border border-white/20 bg-white/10 p-6">
        <p className="text-sm text-slate-200">
          Recuerda que esta es una simulación. Para conectarlo con tu infraestructura real, consulta la sección de API y
          despliegue en la documentación técnica.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <LinkButton href="/dashboard">Ir al panel</LinkButton>
        <button type="button" className={buttonVariants({ variant: "secondary" })} onClick={onBack}>
          Crear otro turno
        </button>
      </div>
    </div>
  );
}

function CheckboxItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);

  return (
    <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border border-white/40 bg-slate-950"
      />
      <span>{label}</span>
    </label>
  );
}

function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={buttonVariants({ variant: "secondary" })}>
      {children}
    </Link>
  );
}
