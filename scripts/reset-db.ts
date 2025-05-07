import { execSync } from "child_process";
import fs from "fs";
import path from "path";

async function main() {
  try {
    console.log("Starting database reset process...");

    // Delete the SQLite database file
    const dbPath = path.join(process.cwd(), "sqlite.db");
    if (fs.existsSync(dbPath)) {
      console.log("Deleting existing database...");
      fs.unlinkSync(dbPath);
      console.log("Database deleted successfully!");
    } else {
      console.log("No existing database found.");
    }

    // Run database migrations
    console.log("\nRunning database migrations...");
    execSync("bun run db:migrate", { stdio: "inherit" });
    console.log("Migrations completed successfully!");

    // Run all seed scripts
    console.log("\nRunning seed scripts...");
    execSync("bun run seed:markup:data", { stdio: "inherit" });
    console.log("Seeding completed successfully!");

    console.log("\nDatabase reset and reseed completed successfully!");
  } catch (error) {
    console.error("Error during database reset:", error);
    process.exit(1);
  }
}

main();
