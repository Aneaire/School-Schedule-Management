import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { rooms } from "~/lib/schema";

export async function POST(request: Request) {
  try {
    const { roomCode } = await request.json();

    const existingRoom = await db
      .select()
      .from(rooms)
      .where(eq(rooms.roomCode, roomCode.toUpperCase()))
      .then((rows) => rows[0]);

    return Response.json({ exists: !!existingRoom });
  } catch (error) {
    console.error("Error checking room:", error);
    return Response.json({ error: "Failed to check room" }, { status: 500 });
  }
}
