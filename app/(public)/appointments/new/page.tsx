"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import confetti from "canvas-confetti";
import { buttonVariants } from "@/components/ui/button";
import { SlotGrid, type Slot } from "@/components/ui/slot-grid";
import { useLanguage, useToast } from "@/components/providers";
import { knownDrivers, slotMatrix } from "@/lib/mock-data";

type Step = "schedule" | "details" | "confirmation";

type AppointmentDraft = {
  slot?: Slot;
  plant?: string;
  dock?: string;
  date?: string;
  driverId?: string;
  driverName?: string;
  plate?: string;
  company?: string;
  cargoType?: string;
};

const cargoTypes = ["General", "Refrigerado", "Peligroso", "Contenedor vacío"];

export default function AppointmentFormPage() {
  const [step, setStep] = useState<Step>("schedule");
  const [draft, setDraft] = useState<AppointmentDraft>({ plant: "Planta Norte" });

  const updateDraft = useCallback((update: Partial<AppointmentDraft>) => {
    setDraft((current) => ({ ...current, ...update }));
  }, []);

  useEffect(() => {
    if (step === "confirmation") {
      const duration = 1200;
      const animationEnd = Date.now() + duration;
      const frame = () => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return;
        confetti({
          startVelocity: 25,
          spread: 360,
          ticks: 40,
          gravity: 0.6,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: ["#3081ff", "#34d399", "#facc15"]
        });
        requestAnimationFrame(frame);
      };
      frame();
    }
  }, [step]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Agendamiento</p>
        <h1 className="text-3xl font-semibold text-white">Solicitar turno demo</h1>
        <p className="text-sm text-slate-300">
          Sigue los tres pasos para reservar una franja, validar documentos y confirmar el turno con notificaciones simuladas.
        </p>
      </header>

      {step === "schedule" ? (
        <ScheduleStep
          selected={draft.slot?.id}
          onSelectSlot={(slot) => updateDraft({ slot })}
          onNext={(data) => {
            updateDraft(data);
            setStep("details");
          }}
        />
      ) : null}

      {step === "details" && draft.slot ? (
        <DetailsStep
          draft={draft}
          onBack={() => setStep("schedule")}
          onConfirm={(data) => {
            updateDraft(data);
            setStep("confirmation");
          }}
        />
      ) : null}

      {step === "confirmation" && draft.slot ? (
        <ConfirmationStep
          draft={draft}
          onReset={() => {
            setDraft({ plant: "Planta Norte" });
            setStep("schedule");
          }}
        />
      ) : null}
    </div>
  );
}

function ScheduleStep({
  selected,
  onSelectSlot,
  onNext
}: {
  selected?: string;
  onSelectSlot: (slot: Slot) => void;
  onNext: (data: Partial<AppointmentDraft>) => void;
}) {
  const { notify } = useToast();
  const { t } = useLanguage();
  const [plant, setPlant] = useState("Planta Norte");
  const [dock, setDock] = useState("Muelle 1");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const handleSelect = (slot: Slot) => {
    if (slot.blocked) {
      notify({ title: "Franja bloqueada", description: t.messages.slotUnavailable, variant: "error" });
      return;
    }
    onSelectSlot(slot);
    notify({ title: "Disponibilidad", description: t.messages.slotAvailable, variant: "success" });
  };

  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/30">
      <header className="space-y-3">
        <h2 className="text-xl font-semibold text-white">1. Selecciona planta y franja</h2>
        <p className="text-sm text-slate-300">
          El mapa refleja el aforo disponible por hora. Las franjas en rojo están bloqueadas por mantenimiento o eventos.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 md:col-span-1">
          <label className="text-sm text-slate-300" htmlFor="plant">
            Planta
          </label>
          <select id="plant" name="plant" className="input" value={plant} onChange={(event) => setPlant(event.target.value)}>
            <option>Planta Norte</option>
            <option>Planta Centro</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-1">
          <label className="text-sm text-slate-300" htmlFor="dock">
            Muelle preferido
          </label>
          <select id="dock" name="dock" className="input" value={dock} onChange={(event) => setDock(event.target.value)}>
            <option>Muelle 1</option>
            <option>Muelle 2</option>
            <option>Muelle 3</option>
            <option>Muelle 4</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-1">
          <label className="text-sm text-slate-300" htmlFor="date">
            Fecha estimada
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className="input"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </div>
      <SlotGrid slots={slotMatrix} selected={selected} onSelect={handleSelect} />
      <div className="flex flex-wrap gap-3 text-sm">
        <button
          type="button"
          className={buttonVariants({ variant: "secondary" })}
          onClick={() => notify({ title: "Simulación", description: t.messages.slotAvailable, variant: "success" })}
        >
          {t.actions.simulateCapacity}
        </button>
        <button
          type="button"
          className={buttonVariants({ size: "lg" })}
          onClick={() =>
            selected
              ? onNext({ plant, dock, date })
              : notify({ title: "Selecciona una franja", description: "Debes elegir una hora para continuar", variant: "error" })
          }
        >
          Continuar
        </button>
      </div>
    </section>
  );
}

function DetailsStep({
  draft,
  onBack,
  onConfirm
}: {
  draft: AppointmentDraft;
  onBack: () => void;
  onConfirm: (data: Partial<AppointmentDraft>) => void;
}) {
  const { notify } = useToast();
  const [documents, setDocuments] = useState({ license: false, soat: false, fumigation: false, policy: false });
  const [formData, setFormData] = useState<AppointmentDraft>(() => ({
    driverName: draft.driverName ?? "",
    driverId: draft.driverId ?? "",
    plate: draft.plate ?? "",
    company: draft.company ?? "",
    cargoType: draft.cargoType ?? cargoTypes[0]
  }));
  const autoFilled = useMemo(() => knownDrivers.find((driver) => driver.id === formData.driverId), [formData.driverId]);

  useEffect(() => {
    if (autoFilled) {
      setFormData((current) => ({ ...current, driverName: autoFilled.name, plate: autoFilled.plate, company: autoFilled.company }));
    }
  }, [autoFilled]);

  const handleChange = (key: keyof AppointmentDraft, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!documents.license || !documents.soat) {
      notify({
        title: "Validación de documentos",
        description: "Debes marcar licencia y SOAT como vigentes",
        variant: "error"
      });
      return;
    }
    onConfirm(formData);
  };

  return (
    <form className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/30" onSubmit={handleSubmit}>
      <header className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white">2. Completa los datos</h2>
        <p className="text-sm text-slate-300">
          Si el conductor ya existe, los datos se autocompletan. Los campos obligatorios muestran validación inmediata.
        </p>
        {autoFilled ? (
          <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
            Coincidencia encontrada: {autoFilled.name} — {autoFilled.company}.
          </p>
        ) : null}
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Documento" id="driverId" value={formData.driverId ?? ""} onChange={(value) => handleChange("driverId", value)} required />
        <Field label="Nombre del conductor" id="driverName" value={formData.driverName ?? ""} onChange={(value) => handleChange("driverName", value)} required />
        <Field label="Placa" id="plate" value={formData.plate ?? ""} onChange={(value) => handleChange("plate", value)} required />
        <Field label="Empresa" id="company" value={formData.company ?? ""} onChange={(value) => handleChange("company", value)} placeholder="Opcional" />
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm text-slate-300" htmlFor="cargoType">
            Tipo de carga
          </label>
          <select
            id="cargoType"
            className="input"
            value={formData.cargoType}
            onChange={(event) => handleChange("cargoType", event.target.value)}
          >
            {cargoTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      <section className="space-y-3">
        <p className="text-sm text-slate-200">Documentos requeridos</p>
        <div className="grid gap-3 md:grid-cols-2">
          <CheckboxItem label="Licencia de conducción vigente" checked={documents.license} onChange={(checked) => setDocuments((current) => ({ ...current, license: checked }))} />
          <CheckboxItem label="SOAT / Seguro obligatorio" checked={documents.soat} onChange={(checked) => setDocuments((current) => ({ ...current, soat: checked }))} />
          <CheckboxItem label="Certificado de fumigación" checked={documents.fumigation} onChange={(checked) => setDocuments((current) => ({ ...current, fumigation: checked }))} />
          <CheckboxItem label="Póliza de responsabilidad civil" checked={documents.policy} onChange={(checked) => setDocuments((current) => ({ ...current, policy: checked }))} />
        </div>
      </section>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={buttonVariants({ variant: "secondary" })} onClick={onBack}>
          Volver
        </button>
        <button type="submit" className={buttonVariants({ size: "lg" })}>
          Confirmar turno
        </button>
      </div>
    </form>
  );
}

function ConfirmationStep({ draft, onReset }: { draft: AppointmentDraft; onReset: () => void }) {
  return (
    <div className="space-y-8 rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-8 text-slate-100">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">¡Turno demo confirmado!</h2>
        <p className="text-sm text-emerald-200">
          Enviamos una confirmación simulada al conductor y notificamos a la planta. Puedes regresar para generar otro turno o
          explorar el panel de planners.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Franja" description={`${draft.slot?.hour} — ${draft.date}`} />
        <InfoCard title="Muelle" description={`${draft.dock} (${draft.plant})`} />
        <InfoCard title="Conductor" description={`${draft.driverName} (${draft.driverId})`} />
        <InfoCard title="Vehículo" description={`${draft.plate} · ${draft.cargoType}`} />
      </div>
      <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-sm text-slate-200">
        <p>
          Escanea el QR para check-in en portería o compártelo con el conductor.
        </p>
        <div className="mt-4 flex h-32 w-32 items-center justify-center rounded-2xl border border-dashed border-white/30 text-xs text-slate-400">
          QR Simulado
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
          Ir al panel
        </Link>
        <button type="button" className={buttonVariants({ variant: "secondary" })} onClick={onReset}>
          Crear otro turno
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  required
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-slate-300" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        required={required}
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border border-white/40 bg-slate-950"
      />
      <span>{label}</span>
    </label>
  );
}

function InfoCard({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-1 text-sm text-white">{description}</p>
    </div>
  );
}
