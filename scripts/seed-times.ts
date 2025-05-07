import { db } from "~/lib/db";
import { days, times } from "~/lib/schema";

// Seed times (7:00 to 19:00, but you may want to adjust to 7:00 to 18:00 if 7pm is removed)
const seedTimes = Array.from({ length: 13 }, (_, i) => {
  const startHour = 7 + i;
  const endHour = startHour + 1;

  return {
    startTime: `${startHour.toString().padStart(2, "0")}:00`,
    endTime: `${endHour.toString().padStart(2, "0")}:00`,
  };
});

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
