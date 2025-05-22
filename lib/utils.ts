import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeRange(
  startHour: number,
  durationInMinutes: number
): string {
  const to12Hour = (hour: number) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 || hour === 24 ? "AM" : "PM";
    return `${h}:00 ${ampm}`;
  };

  const endHour = startHour + durationInMinutes / 60;
  return `${to12Hour(startHour)} - ${to12Hour(endHour)}`;
}
