import { exec } from "child_process";
import { NextResponse } from "next/server";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Execute the reset-db script
    const { stdout, stderr } = await execAsync("tsx scripts/reset-db.ts");

    if (stderr) {
      console.error("Error resetting database:", stderr);
      return NextResponse.json(
        { error: "Failed to reset database" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Database reset successfully", output: stdout },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error executing reset script:", error);
    return NextResponse.json(
      { error: "Failed to execute reset script" },
      { status: 500 }
    );
  }
}
