import { subjects } from "~/lib/schema";
import { db } from "~/lib/tursoDb";

const seedSubjects = [
  {
    subjectCode: "COLL368",
    subjectName: "College Algebra",
    units: 3,
  },
  {
    subjectCode: "BUSI281",
    subjectName: "Business Ethics",
    units: 3,
  },
  {
    subjectCode: "FINA281",
    subjectName: "Financial Accounting",
    units: 3,
  },
  {
    subjectCode: "PROG444",
    subjectName: "Programming 1",
    units: 3,
  },
  {
    subjectCode: "DATA182",
    subjectName: "Database Systems",
    units: 3,
  },
  {
    subjectCode: "ENGL172",
    subjectName: "English Communication",
    units: 3,
  },
  {
    subjectCode: "MARK497",
    subjectName: "Marketing Principles",
    units: 3,
  },
  {
    subjectCode: "PHYS250",
    subjectName: "Physics",
    units: 3,
  },
  {
    subjectCode: "TAXA429",
    subjectName: "Taxation",
    units: 3,
  },
  {
    subjectCode: "AUDI287",
    subjectName: "Auditing",
    units: 3,
  },
  {
    subjectCode: "LAW 462",
    subjectName: "Law on Obligations",
    units: 3,
  },
  {
    subjectCode: "RIZA445",
    subjectName: "Rizal's Life",
    units: 3,
  },
  {
    subjectCode: "FILI303",
    subjectName: "Filipino 1",
    units: 3,
  },
  {
    subjectCode: "DIGI367",
    subjectName: "Digital Systems",
    units: 3,
  },
  {
    subjectCode: "WEB 309",
    subjectName: "Web Development",
    units: 3,
  },
  {
    subjectCode: "DATA340",
    subjectName: "Data Structures",
    units: 3,
  },
  {
    subjectCode: "MANA282",
    subjectName: "Managerial Accounting",
    units: 3,
  },
  {
    subjectCode: "COMP383",
    subjectName: "Computer Networks",
    units: 3,
  },
  {
    subjectCode: "OPER325",
    subjectName: "Operations Management",
    units: 3,
  },
  {
    subjectCode: "RESE214",
    subjectName: "Research Methods",
    units: 3,
  },
];

async function main() {
  try {
    console.log("Seeding subjects...");

    // Insert each subject
    for (const subject of seedSubjects) {
      await db.insert(subjects).values({
        subjectCode: subject.subjectCode,
        subjectName: subject.subjectName,
        units: subject.units,
      });
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
