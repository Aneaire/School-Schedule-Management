import { db } from "~/lib/db";
import { subjects } from "~/lib/schema";

const seedSubjects = [
  {
    subjectCode: "CS101",
    subjectName: "Introduction to Computer Science",
    units: 3,
  },
  {
    subjectCode: "CS102",
    subjectName: "Data Structures and Algorithms",
    units: 3,
  },
  {
    subjectCode: "CS103",
    subjectName: "Object-Oriented Programming",
    units: 3,
  },
  {
    subjectCode: "CS104",
    subjectName: "Database Management Systems",
    units: 3,
  },
  { subjectCode: "CS105", subjectName: "Web Development", units: 3 },
  { subjectCode: "CS106", subjectName: "Computer Networks", units: 3 },
  { subjectCode: "CS107", subjectName: "Operating Systems", units: 3 },
  { subjectCode: "CS108", subjectName: "Software Engineering", units: 3 },
  { subjectCode: "CS109", subjectName: "Artificial Intelligence", units: 3 },
  { subjectCode: "CS110", subjectName: "Machine Learning", units: 3 },
  { subjectCode: "CS111", subjectName: "Computer Security", units: 3 },
  {
    subjectCode: "CS112",
    subjectName: "Mobile Application Development",
    units: 3,
  },
  { subjectCode: "CS113", subjectName: "Cloud Computing", units: 3 },
  { subjectCode: "CS114", subjectName: "Data Science", units: 3 },
  { subjectCode: "CS115", subjectName: "Computer Graphics", units: 3 },
];

async function main() {
  try {
    console.log("Seeding subjects...");
    for (const subject of seedSubjects) {
      await db.insert(subjects).values(subject);
      console.log(
        `Added subject: ${subject.subjectCode} - ${subject.subjectName}`
      );
    }
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding subjects:", error);
    process.exit(1);
  }
}

main();
