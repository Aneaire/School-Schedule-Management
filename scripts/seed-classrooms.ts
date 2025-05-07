import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { rooms } from "~/lib/schema";

const seedRooms = [
  { roomCode: "CBS 1 101", roomName: "College of Business Studies" },
  { roomCode: "CBS 1 102", roomName: "College of Business Studies" },
  { roomCode: "CBS 1 103", roomName: "College of Business Studies" },
  { roomCode: "CBS 1 104", roomName: "College of Business Studies" },
  { roomCode: "CBS 1 105", roomName: "College of Business Studies" },
  { roomCode: "CBS 2 101", roomName: "College of Business Studies" },
  { roomCode: "CBS 2 102", roomName: "College of Business Studies" },
  { roomCode: "CBS 2 103", roomName: "College of Business Studies" },
  { roomCode: "CBS 2 104", roomName: "College of Business Studies" },
  { roomCode: "CBS 2 105", roomName: "College of Business Studies" },
  { roomCode: "CAS 1 201", roomName: "College of Arts and Studies" },
  { roomCode: "CAS 1 202", roomName: "College of Arts and Studies" },
  { roomCode: "CAS 1 203", roomName: "College of Arts and Studies" },
  { roomCode: "CAS 1 204", roomName: "College of Arts and Studies" },
  { roomCode: "CAS 1 205", roomName: "College of Arts and Studies" },
  { roomCode: "New CAS 101", roomName: "New College of Arts and Studies" },
  { roomCode: "New CAS 102", roomName: "New College of Arts and Studies" },
  { roomCode: "New CAS 103", roomName: "New College of Arts and Studies" },
  { roomCode: "New CAS 104", roomName: "New College of Arts and Studies" },
  { roomCode: "New CAS 105", roomName: "New College of Arts and Studies" },
];

async function main() {
  try {
    console.log("Seeding rooms...");
    for (const room of seedRooms) {
      // Check if the room already exists
      const existingRoom = await db
        .select({ roomCode: rooms.roomCode })
        .from(rooms)
        .where(eq(rooms.roomCode, room.roomCode));

      if (existingRoom.length === 0) {
        await db.insert(rooms).values(room);
        console.log(`Added room: ${room.roomCode} - ${room.roomName}`);
      } else {
        console.log(
          `Room already exists, skipping: ${room.roomCode} - ${room.roomName}`
        );
      }
    }
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding rooms:", error);
    process.exit(1);
  }
}

main();
