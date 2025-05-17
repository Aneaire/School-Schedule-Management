// seed-courses.ts
import { courses } from "~/lib/schema";
import { db } from "~/lib/tursoDb";

const seedCourses = [
  {
    courseCode: "BSA",
    courseName: "Bachelor of Science in Accountancy",
  },
  {
    courseCode: "BSAIS",
    courseName: "Bachelor of Science in Information Systems",
  },
  {
    courseCode: "BS Marketing",
    courseName: "Bachelor of Science in Marketing",
  },
  {
    courseCode: "BSE",
    courseName: "Bachelor of Science in Entrepreneurship",
  },
  {
    courseCode: "BS Public Administration",
    courseName: "Bachelor of Science in Public Administration",
  },
];

async function main() {
  try {
    console.log("Seeding courses...");

    for (const course of seedCourses) {
      await db.insert(courses).values(course);
      console.log(`Added course: ${course.courseCode}`);
    }

    console.log("Courses seeded successfully!");
  } catch (error) {
    console.error("Error seeding courses:", error);
    process.exit(1);
  }
}

main();
