import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { rooms } from "~/lib/schema";
import { db } from "~/lib/tursoDb";

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const { roomId } = await params;

  try {
    const result = await db
      .select()
      .from(rooms)
      .where(eq(rooms.roomId, Number(roomId)));
    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Room not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(result[0]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch room" }), {
      status: 500,
    });
  }
}
