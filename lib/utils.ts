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

export function formatTimeTo12Hour(time: string): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  if (minute === 0) return `${formattedHour}${suffix}`;
  return `${formattedHour}:${minute}${suffix}`;
}
