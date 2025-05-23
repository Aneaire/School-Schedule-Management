import { execSync } from "child_process";
import { db } from "~/lib/tursoDb";

async function resetTursoDatabase() {
  try {
    console.log("Starting Turso database reset...");

    // Disable foreign key checks
    await db.run(`PRAGMA foreign_keys = OFF;`);

    const tables = [
      "schedules",
      "classes",
      "sections",
      "courses",
      "days",
      "rooms",
      "times",
      "subjects",
      "teachers",
    ];

    for (const table of tables) {
      console.log(`Dropping table if exists: ${table}`);
      await db.run(`DROP TABLE IF EXISTS ${table};`);
    }

    // Re-enable foreign key checks
    await db.run(`PRAGMA foreign_keys = ON;`);

    console.log("All tables dropped successfully.");

    // Run migrations
    console.log("Running migrations...");
    execSync("bun run db:migrate", { stdio: "inherit" });
    console.log("Migrations completed.");

    // Run seed scripts
    console.log("Running seed scripts...");
    execSync("bun run seed:markup:data", { stdio: "inherit" });
    console.log("Seeding completed.");

    console.log("Turso database reset and reseed completed successfully!");
  } catch (error) {
    console.error("Error resetting Turso database:", error);
    process.exit(1);
  }
}

resetTursoDatabase();
