import { execSync } from "child_process";

async function main() {
  try {
    console.log("Starting to run all seed scripts...");

    // Run all seed scripts in sequence
    console.log("\nSeeding times...");
    execSync("bun run seed:times", { stdio: "inherit" });

    console.log("\nSeeding classrooms...");
    execSync("bun run seed:classrooms", { stdio: "inherit" });

    console.log("\nSeeding subjects...");
    execSync("bun run seed:subjects", { stdio: "inherit" });

    console.log("\nSeeding teachers...");
    execSync("bun run seed:teachers", { stdio: "inherit" });

    console.log("\nSeeding courses...");
    execSync("bun run seed:courses", { stdio: "inherit" });

    console.log("\nSeeding sections...");
    execSync("bun run seed:sections", { stdio: "inherit" });

    console.log("\nAll seed scripts completed successfully!");
  } catch (error) {
    console.error("Error running seed scripts:", error);
    process.exit(1);
  }
}

main();
