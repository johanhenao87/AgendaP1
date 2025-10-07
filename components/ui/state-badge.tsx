import clsx from "clsx";

type Props = {
  state: string;
};

const palette: Record<string, string> = {
  Confirmado: "bg-emerald-500/20 text-emerald-200 border-emerald-400/60",
  "En proceso": "bg-amber-500/20 text-amber-200 border-amber-400/60",
  Pendiente: "bg-blue-500/20 text-blue-200 border-blue-400/60",
  Cancelado: "bg-red-500/20 text-red-200 border-red-400/60"
};

export function StateBadge({ state }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        palette[state] ?? "border-white/20 bg-white/10 text-slate-100"
      )}
    >
      {state}
    </span>
  );
}
