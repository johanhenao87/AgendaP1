import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { mockKpis } from "@/lib/mock-data";

const heatmap = [
  { day: "Lun", slots: [70, 65, 82, 90, 60] },
  { day: "Mar", slots: [62, 68, 79, 88, 55] },
  { day: "Mié", slots: [58, 74, 85, 92, 64] },
  { day: "Jue", slots: [60, 71, 88, 94, 70] },
  { day: "Vie", slots: [55, 66, 80, 86, 58] }
];

const slotLabels = ["06h", "08h", "10h", "12h", "14h"];

export default function KpiPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-200">Análisis</p>
        <h1 className="text-3xl font-semibold text-white">KPIs y simulador</h1>
        <p className="text-sm text-slate-300">
          Evalúa la eficiencia operativa con métricas clave y simula escenarios de capacidad antes de cambios en la
          planta.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {mockKpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader title={kpi.label} description={kpi.trend} />
            <CardContent>
              <p className="text-4xl font-semibold text-white">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="bg-white/5">
          <CardHeader title="Ocupación de muelles" description="Mapa de calor semanal (datos simulados)" />
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="pb-3 text-left text-xs uppercase tracking-wide text-slate-400">Día</th>
                    {slotLabels.map((label) => (
                      <th key={label} className="pb-3 text-xs uppercase tracking-wide text-slate-400">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {heatmap.map((row) => (
                    <tr key={row.day}>
                      <td className="py-2 pr-4 text-slate-200">{row.day}</td>
                      {row.slots.map((value, index) => (
                        <td key={index}>
                          <div
                            className="h-10 rounded-2xl"
                            style={{
                              background: `linear-gradient(135deg, rgba(48,127,255,${value / 120}), rgba(20,47,108,0.8))`,
                              color: value > 75 ? "white" : "#cbd5f5",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600
                            }}
                          >
                            {value}%
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            title="Simulador rápido"
            description="Ajusta parámetros para estimar capacidad disponible durante el día."
          />
          <CardContent>
            <form className="space-y-4 text-sm">
              <div className="space-y-2">
                <label className="text-slate-300" htmlFor="capacity">Cupos por franja</label>
                <input id="capacity" name="capacity" type="number" defaultValue={8} className="input" />
              </div>
              <div className="space-y-2">
                <label className="text-slate-300" htmlFor="duration">Duración promedio (min)</label>
                <input id="duration" name="duration" type="number" defaultValue={45} className="input" />
              </div>
              <div className="space-y-2">
                <label className="text-slate-300" htmlFor="noShow">No show esperado (%)</label>
                <input id="noShow" name="noShow" type="number" defaultValue={5} className="input" />
              </div>
              <button type="button" className="mt-4 w-full rounded-2xl bg-brand-500 py-2 font-semibold text-white">
                Calcular capacidad
              </button>
              <p className="text-xs text-slate-400">
                Los resultados se integrarán con el motor de reglas en futuras iteraciones.
              </p>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
