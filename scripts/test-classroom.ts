import { rooms } from "~/lib/schema";
import { db } from "~/lib/tursoDb";

const seedClassrooms = [
  { roomCode: "CLS101", roomName: "Computer Laboratory 1" },
  { roomCode: "CLS102", roomName: "Computer Laboratory 2" },
  { roomCode: "CLS201", roomName: "Physics Laboratory" },
  { roomCode: "CLS202", roomName: "Chemistry Laboratory" },
  { roomCode: "RM101", roomName: "Lecture Room 101" },
  { roomCode: "RM102", roomName: "Lecture Room 102" },
  { roomCode: "RM201", roomName: "Lecture Room 201" },
  { roomCode: "RM202", roomName: "Lecture Room 202" },
  { roomCode: "AUD1", roomName: "Main Auditorium" },
  { roomCode: "LIB1", roomName: "Library Room" },
];

async function main() {
  try {
    console.log("Seeding classrooms...");
    for (const classroom of seedClassrooms) {
      await db.insert(rooms).values(classroom);
      console.log(
        `Added classroom: ${classroom.roomCode} - ${classroom.roomName}`
      );
    }
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding classrooms:", error);
    process.exit(1);
  }
}

main();
