import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { rooms } from "~/lib/schema";
import { db } from "~/lib/tursoDb";

export async function GET() {
  try {
    const allRooms = await db.select().from(rooms);
    return NextResponse.json(allRooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomCode, roomName } = body;

    if (!roomCode || !roomName) {
      return NextResponse.json(
        { error: "Room code and name are required" },
        { status: 400 }
      );
    }

    const [newRoom] = await db
      .insert(rooms)
      .values({
        roomCode,
        roomName,
      })
      .returning();

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const roomId = url.pathname.split("/").pop();

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    const id = parseInt(roomId);
    await db.delete(rooms).where(eq(rooms.roomId, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 }
    );
  }
}
