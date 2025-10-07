"use client";

import { useMemo } from "react";

type PieDatum = {
  label: string;
  value: number;
};

const chartColors = ["#3081ff", "#34d399", "#f59e0b", "#ef4444"];

export function PieChart({ data }: { data: PieDatum[] }) {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
  let current = 0;
  const segments = data.map((item, index) => {
    const start = (current / total) * 360;
    const sweep = (item.value / total) * 360;
    current += item.value;
    return `${chartColors[index % chartColors.length]} ${start}deg ${start + sweep}deg`;
  });

  return (
    <div className="flex items-center gap-6">
      <div
        className="h-40 w-40 rounded-full border border-white/10"
        style={{ background: `conic-gradient(${segments.join(",")})` }}
      />
      <ul className="space-y-2 text-sm text-slate-300">
        {data.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: chartColors[index % chartColors.length] }}
            />
            <span className="text-white">{item.label}</span>
            <span className="text-xs text-slate-400">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type LineDatum = {
  label: string;
  value: number;
};

export function LineChart({ data }: { data: LineDatum[] }) {
  const maxValue = Math.max(...data.map((item) => item.value));
  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 100 100" className="h-40 w-full rounded-2xl border border-white/10 bg-white/5 p-2">
        <polyline
          fill="rgba(48,129,255,0.3)"
          stroke="#3081ff"
          strokeWidth="1.5"
          points={`0,100 ${points} 100,100`}
        />
      </svg>
      <div className="flex justify-between text-xs text-slate-400">
        {data.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}

export function CapacityBar({ value }: { value: number }) {
  const percentage = Math.min(Math.round(value), 120);
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
      <p className="text-xs uppercase tracking-wide text-slate-400">Capacidad estimada</p>
      <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-400 via-emerald-400 to-emerald-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-white">{percentage} citas disponibles</p>
    </div>
  );
}
