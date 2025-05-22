export const HOURS = Array.from({ length: 25 }, (_, i) => 7 + i * 0.5);

export function formatHour(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  const hh = h.toString().padStart(2, "0");
  const mm = m === 0 ? "00" : "30";
  return `${hh}:${mm}`;
}

export function parseHour(time?: string): number {
  if (!time || typeof time !== "string" || !time.includes(":")) return NaN;
  const [h, m] = time.split(":" as const).map(Number);
  return h + m / 60;
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

export function formatTimeTo12Hour2(hour: number): string {
  const h = Math.floor(hour) % 12 || 12;
  const m = (hour % 1) * 60;
  const ampm = hour < 12 || hour === 24 ? "AM" : "PM";
  return `${h}:${m === 0 ? "00" : "30"} ${ampm}`;
}
