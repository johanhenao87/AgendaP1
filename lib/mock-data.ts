export const mockAppointments = [
  {
    id: "TUR-24001",
    driver: "Carlos Pérez",
    plate: "ABC123",
    dock: "Muelle 3",
    status: "Confirmado",
    scheduledAt: "2024-09-12T08:00:00Z",
    toleranceMinutes: 15
  },
  {
    id: "TUR-24002",
    driver: "María Gómez",
    plate: "XYZ987",
    dock: "Muelle 1",
    status: "En proceso",
    scheduledAt: "2024-09-12T09:30:00Z",
    toleranceMinutes: 10
  },
  {
    id: "TUR-24003",
    driver: "Luis Rodríguez",
    plate: "JKL456",
    dock: "Muelle 2",
    status: "Pendiente",
    scheduledAt: "2024-09-12T11:00:00Z",
    toleranceMinutes: 20
  }
];

export const mockKpis = [
  {
    label: "SLA cumplido",
    value: "92%",
    trend: "+4% vs. semana anterior"
  },
  {
    label: "Ocupación muelles",
    value: "78%",
    trend: "-3% vs. objetivo"
  },
  {
    label: "Cancelaciones",
    value: "12",
    trend: "2 reprogramadas"
  }
];

export const mockRules = [
  {
    name: "Planta Norte — Prioridad perecederos",
    description: "Los turnos de productos refrigerados tienen prioridad entre 6:00 y 9:00 am.",
    lastUpdatedBy: "Ana Ruiz"
  },
  {
    name: "Bloqueo mantenimiento Muelle 4",
    description: "No se asignan turnos entre el 15 y 16 de septiembre por mantenimiento preventivo.",
    lastUpdatedBy: "Juan Martínez"
  }
];
