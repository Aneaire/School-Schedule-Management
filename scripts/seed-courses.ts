// seed-courses.ts
import { db } from "~/lib/db";
import { courses } from "~/lib/schema";

const seedCourses = [
  {
    courseId: 1,
    courseCode: "BSA",
    courseName: "Bachelor of Science in Accountancy",
  },
  {
    courseId: 2,
    courseCode: "BSAIS",
    courseName: "Bachelor of Science in Information Systems",
  },
  {
    courseId: 3,
    courseCode: "BS Marketing",
    courseName: "Bachelor of Science in Marketing",
  },
  {
    courseId: 4,
    courseCode: "BSE",
    courseName: "Bachelor of Science in Entrepreneurship",
  },
  {
    courseId: 5,
    courseCode: "BS Public Administration",
    courseName: "Bachelor of Science in Public Administration",
  },
];

async function main() {
  try {
    console.log("🌱 Seeding courses...");

    for (const course of seedCourses) {
      await db.insert(courses).values({
        courseId: course.courseId,
        courseCode: course.courseCode,
        courseName: course.courseName,
      });
      console.log(`✅ Added course: ${course.courseCode}`);
    }

    console.log("✅ Courses seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
    process.exit(1);
  }
}

main();
