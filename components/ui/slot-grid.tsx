"use client";

import clsx from "clsx";
import { useMemo } from "react";

export type Slot = {
  id: string;
  hour: string;
  available: number;
  capacity: number;
  blocked?: boolean;
};

type Props = {
  slots: Slot[];
  selected?: string;
  onSelect: (slot: Slot) => void;
};

export function SlotGrid({ slots, selected, onSelect }: Props) {
  const occupancyByHour = useMemo(
    () =>
      slots.reduce<Record<string, number>>((acc, slot) => {
        acc[slot.hour] = Math.round((slot.available / slot.capacity) * 100);
        return acc;
      }, {}),
    [slots]
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {slots.map((slot) => {
          const percentage = occupancyByHour[slot.hour];
          const isSelected = selected === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => (!slot.blocked ? onSelect(slot) : null)}
              className={clsx(
                "flex items-center justify-between rounded-2xl border p-4 text-left transition",
                slot.blocked
                  ? "cursor-not-allowed border-red-500/60 bg-red-500/10 text-red-100"
                  : isSelected
                    ? "border-brand-400 bg-brand-500/20 text-white"
                    : "border-white/10 bg-white/5 text-slate-200 hover:border-brand-400/80 hover:bg-brand-500/10 hover:text-white"
              )}
              aria-pressed={isSelected}
              aria-disabled={slot.blocked}
              title={slot.blocked ? "Fuera de operación" : undefined}
            >
              <div>
                <p className="text-lg font-semibold">{slot.hour}</p>
                <p className="text-xs text-slate-400">{slot.available} / {slot.capacity} cupos</p>
              </div>
              <div className="text-right text-xs font-semibold">
                <p>Ocupación</p>
                <p>{percentage}%</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
