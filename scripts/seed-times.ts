import { days, times } from "~/lib/schema";
import { db } from "~/lib/tursoDb";
import { HOURS } from "~/utils/time";

// Seed times (7:00 to 19:00, but you may want to adjust to 7:00 to 18:00 if 7pm is removed)
const seedTimes = HOURS.map((hour) => {
  const startHour = formatHour(hour);
  const endHour = formatHour(hour + 0.5);

  return {
    startTime: startHour,
    endTime: endHour,
  };
});

function formatHour(hour: number): string {
  const h = Math.floor(hour);
  const m = (hour - h) * 60;
  const hh = h.toString().padStart(2, "0");
  const mm = m === 0 ? "00" : "30";
  return `${hh}:${mm}`;
}

// Seed days
const seedDays = [
  { dayName: "Monday" },
  { dayName: "Tuesday" },
  { dayName: "Wednesday" },
  { dayName: "Thursday" },
  { dayName: "Friday" },
  { dayName: "Saturday" },
  { dayName: "Sunday" },
];

async function main() {
  try {
    console.log("Seeding days...");
    for (const day of seedDays) {
      await db.insert(days).values(day);
      console.log(`Added day: ${day.dayName}`);
    }

    console.log("Seeding times...");
    for (const time of seedTimes) {
      await db.insert(times).values(time);
      console.log(`Added time slot: ${time.startTime} - ${time.endTime}`);
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding days/times:", error);
    process.exit(1);
  }
}

main();
