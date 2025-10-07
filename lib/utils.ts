import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHour(date: string) {
  return new Date(date).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

export function remainingTolerance(date: string, toleranceMinutes: number) {
  const now = new Date();
  const scheduled = new Date(date);
  const toleranceEnd = new Date(scheduled.getTime() + toleranceMinutes * 60 * 1000);
  const diff = Math.round((toleranceEnd.getTime() - now.getTime()) / 60000);
  return diff;
}
