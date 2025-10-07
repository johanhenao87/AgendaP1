export type Appointment = {
  id: string;
  driver: string;
  plate: string;
  dock: string;
  status: "Confirmado" | "En proceso" | "Pendiente" | "Cancelado";
  scheduledAt: string;
  toleranceMinutes: number;
};

export const mockAppointments: Appointment[] = [
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

export type DriverRecord = {
  id: string;
  name: string;
  plate: string;
  company: string;
};

export const knownDrivers: DriverRecord[] = [
  { id: "1029384756", name: "Carlos Pérez", plate: "ABC123", company: "Transporte Norte" },
  { id: "1098765432", name: "María Gómez", plate: "XYZ987", company: "Logística Andina" },
  { id: "1122334455", name: "Luis Rodríguez", plate: "JKL456", company: "Carga Express" }
];

export type SlotMatrix = {
  id: string;
  hour: string;
  available: number;
  capacity: number;
  blocked?: boolean;
};

export const slotMatrix: SlotMatrix[] = [
  { id: "slot-1", hour: "06:00", available: 6, capacity: 8 },
  { id: "slot-2", hour: "07:00", available: 5, capacity: 8 },
  { id: "slot-3", hour: "08:00", available: 0, capacity: 8, blocked: true },
  { id: "slot-4", hour: "09:00", available: 7, capacity: 8 },
  { id: "slot-5", hour: "10:00", available: 4, capacity: 8 },
  { id: "slot-6", hour: "11:00", available: 2, capacity: 8 }
];

export type NotificationLog = {
  id: string;
  channel: "whatsapp" | "email" | "sms";
  message: string;
  sentAt: string;
};

export const notificationLogs: NotificationLog[] = [
  {
    id: "notif-1",
    channel: "whatsapp",
    message: "Confirmación enviada al conductor TUR-24001",
    sentAt: "Hoy, 07:45"
  },
  {
    id: "notif-2",
    channel: "email",
    message: "Recordatorio 2h antes para TUR-24002",
    sentAt: "Hoy, 07:30"
  },
  {
    id: "notif-3",
    channel: "sms",
    message: "Actualización de muelle TUR-24003",
    sentAt: "Ayer, 18:05"
  }
];

export type DockAssignment = {
  id: string;
  driver: string;
  status: Appointment["status"];
  slotId: string;
};

export type DockSlot = {
  id: string;
  label: string;
  hour: string;
  blocked?: boolean;
};

export const dockSlots: DockSlot[] = [
  { id: "dock-1", label: "Muelle 1", hour: "06:00" },
  { id: "dock-2", label: "Muelle 2", hour: "07:00" },
  { id: "dock-3", label: "Muelle 3", hour: "08:00", blocked: true },
  { id: "dock-4", label: "Muelle 4", hour: "09:00" }
];

export const dockAssignments: DockAssignment[] = [
  { id: "TUR-24001", driver: "Carlos Pérez", status: "Confirmado", slotId: "dock-2" },
  { id: "TUR-24002", driver: "María Gómez", status: "En proceso", slotId: "dock-1" },
  { id: "TUR-24003", driver: "Luis Rodríguez", status: "Pendiente", slotId: "dock-4" }
];

export const kpiStatusDistribution = [
  { label: "Confirmados", value: 46 },
  { label: "En proceso", value: 18 },
  { label: "Pendientes", value: 12 },
  { label: "Cancelados", value: 4 }
];

export const kpiTimeseries = [
  { label: "Lun", value: 42 },
  { label: "Mar", value: 44 },
  { label: "Mié", value: 39 },
  { label: "Jue", value: 46 },
  { label: "Vie", value: 48 }
];
