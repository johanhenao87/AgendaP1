export type Language = "es" | "en";

type Dictionary = {
  navigation: {
    home: string;
    newAppointment: string;
    dashboard: string;
    kpis: string;
  };
  actions: {
    createTurn: string;
    explorePanel: string;
    simulateCapacity: string;
    cancel: string;
    confirm: string;
    tryAgain: string;
    goHome: string;
  };
  messages: {
    slotAvailable: string;
    slotUnavailable: string;
    cancellationAllowed: (minutes: number) => string;
    cancellationBlocked: string;
  };
};

export const languages: Language[] = ["es", "en"];

export const dictionary: Record<Language, Dictionary> = {
  es: {
    navigation: {
      home: "Inicio",
      newAppointment: "Agenda un turno",
      dashboard: "Panel",
      kpis: "KPIs"
    },
    actions: {
      createTurn: "Crear turno",
      explorePanel: "Explorar panel",
      simulateCapacity: "Simular capacidad",
      cancel: "Cancelar",
      confirm: "Confirmar",
      tryAgain: "Intentar de nuevo",
      goHome: "Ir al inicio"
    },
    messages: {
      slotAvailable: "Cupo disponible. Confirma para reservar la franja.",
      slotUnavailable: "La franja está bloqueada por mantenimiento.",
      cancellationAllowed: (minutes) =>
        `Puedes cancelar este turno. Aún quedan ${minutes} minutos de tolerancia.`,
      cancellationBlocked:
        "Ya no puedes cancelar el turno desde la plataforma. Contacta al operador."
    }
  },
  en: {
    navigation: {
      home: "Home",
      newAppointment: "Book a slot",
      dashboard: "Control room",
      kpis: "KPIs"
    },
    actions: {
      createTurn: "Create slot",
      explorePanel: "Open dashboard",
      simulateCapacity: "Simulate capacity",
      cancel: "Cancel",
      confirm: "Confirm",
      tryAgain: "Try again",
      goHome: "Back home"
    },
    messages: {
      slotAvailable: "Slot available. Confirm to reserve the window.",
      slotUnavailable: "This slot is blocked for maintenance.",
      cancellationAllowed: (minutes) =>
        `You can cancel this slot. ${minutes} minutes of tolerance remain.`,
      cancellationBlocked: "Cancellation period elapsed. Contact the operator."
    }
  }
};

export function translate(language: Language) {
  return dictionary[language];
}
