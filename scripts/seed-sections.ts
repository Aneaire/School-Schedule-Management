import { sections } from "~/lib/schema";
import { db } from "~/lib/tursoDb";

const seedStudentSections = [
  // BSA Sections (courseId: 1)
  { courseId: 1, yearLevel: 1, section: "BSA-1A" },
  { courseId: 1, yearLevel: 1, section: "BSA-1B" },
  { courseId: 1, yearLevel: 1, section: "BSA-1C" },
  { courseId: 1, yearLevel: 1, section: "BSA-1D" },
  { courseId: 1, yearLevel: 1, section: "BSA-1E" },
  { courseId: 1, yearLevel: 1, section: "BSA-1F" },
  { courseId: 1, yearLevel: 1, section: "BSA-1G" },
  { courseId: 1, yearLevel: 1, section: "BSA-1H" },
  { courseId: 1, yearLevel: 1, section: "BSA-1I" },
  { courseId: 1, yearLevel: 1, section: "BSA-1J" },
  { courseId: 1, yearLevel: 2, section: "BSA-2A" },
  { courseId: 1, yearLevel: 2, section: "BSA-2B" },
  { courseId: 1, yearLevel: 2, section: "BSA-2C" },
  { courseId: 1, yearLevel: 2, section: "BSA-2D" },
  { courseId: 1, yearLevel: 2, section: "BSA-2E" },
  { courseId: 1, yearLevel: 2, section: "BSA-2F" },
  { courseId: 1, yearLevel: 2, section: "BSA-2G" },
  { courseId: 1, yearLevel: 2, section: "BSA-2H" },
  { courseId: 1, yearLevel: 3, section: "BSA-3A" },
  { courseId: 1, yearLevel: 3, section: "BSA-3B" },
  { courseId: 1, yearLevel: 3, section: "BSA-3C" },
  { courseId: 1, yearLevel: 3, section: "BSA-3D" },
  { courseId: 1, yearLevel: 3, section: "BSA-3E" },
  { courseId: 1, yearLevel: 3, section: "BSA-3F" },
  { courseId: 1, yearLevel: 3, section: "BSA-3G" },
  { courseId: 1, yearLevel: 3, section: "BSA-3H" },
  { courseId: 1, yearLevel: 4, section: "BSA-4A" },
  { courseId: 1, yearLevel: 4, section: "BSA-4B" },
  { courseId: 1, yearLevel: 4, section: "BSA-4C" },
  { courseId: 1, yearLevel: 4, section: "BSA-4D" },

  // BSAIS Sections (courseId: 2)
  { courseId: 2, yearLevel: 1, section: "BSAIS-1A" },
  { courseId: 2, yearLevel: 1, section: "BSAIS-1B" },
  { courseId: 2, yearLevel: 1, section: "BSAIS-1C" },
  { courseId: 2, yearLevel: 1, section: "BSAIS-1D" },
  { courseId: 2, yearLevel: 1, section: "BSAIS-1E" },
  { courseId: 2, yearLevel: 2, section: "BSAIS-2A" },
  { courseId: 2, yearLevel: 2, section: "BSAIS-2B" },
  { courseId: 2, yearLevel: 2, section: "BSAIS-2C" },
  { courseId: 2, yearLevel: 2, section: "BSAIS-2D" },
  { courseId: 2, yearLevel: 2, section: "BSAIS-2E" },
  { courseId: 2, yearLevel: 2, section: "BSAIS-2F" },
  { courseId: 2, yearLevel: 2, section: "BSAIS-2G" },
  { courseId: 2, yearLevel: 3, section: "BSAIS-3A" },
  { courseId: 2, yearLevel: 3, section: "BSAIS-3B" },
  { courseId: 2, yearLevel: 3, section: "BSAIS-3C" },
  { courseId: 2, yearLevel: 3, section: "BSAIS-3D" },
  { courseId: 2, yearLevel: 3, section: "BSAIS-3E" },
  { courseId: 2, yearLevel: 3, section: "BSAIS-3F" },
  { courseId: 2, yearLevel: 4, section: "BSAIS-4A" },
  { courseId: 2, yearLevel: 4, section: "BSAIS-4B" },
  { courseId: 2, yearLevel: 4, section: "BSAIS-4C" },
  { courseId: 2, yearLevel: 4, section: "BSAIS-4D" },
  { courseId: 2, yearLevel: 4, section: "BSAIS-4E" },
  { courseId: 2, yearLevel: 4, section: "BSAIS-4F" },
  { courseId: 2, yearLevel: 4, section: "BSAIS-4G" },

  // BS Marketing Sections (courseId: 3)
  { courseId: 3, yearLevel: 1, section: "BSMarketing-1A" },
  { courseId: 3, yearLevel: 1, section: "BSMarketing-1B" },
  { courseId: 3, yearLevel: 1, section: "BSMarketing-1C" },
  { courseId: 3, yearLevel: 1, section: "BSMarketing-1D" },
  { courseId: 3, yearLevel: 1, section: "BSMarketing-1E" },
  { courseId: 3, yearLevel: 1, section: "BSMarketing-1F" },
  { courseId: 3, yearLevel: 1, section: "BSMarketing-1G" },
  { courseId: 3, yearLevel: 1, section: "BSMarketing-1H" },
  { courseId: 3, yearLevel: 2, section: "BSMarketing-2A" },
  { courseId: 3, yearLevel: 2, section: "BSMarketing-2B" },
  { courseId: 3, yearLevel: 2, section: "BSMarketing-2C" },
  { courseId: 3, yearLevel: 2, section: "BSMarketing-2D" },
  { courseId: 3, yearLevel: 2, section: "BSMarketing-2E" },
  { courseId: 3, yearLevel: 2, section: "BSMarketing-2F" },
  { courseId: 3, yearLevel: 2, section: "BSMarketing-2G" },
  { courseId: 3, yearLevel: 2, section: "BSMarketing-2H" },
  { courseId: 3, yearLevel: 2, section: "BSMarketing-2I" },
  { courseId: 3, yearLevel: 3, section: "BSMarketing-3A" },
  { courseId: 3, yearLevel: 3, section: "BSMarketing-3B" },
  { courseId: 3, yearLevel: 3, section: "BSMarketing-3C" },
  { courseId: 3, yearLevel: 4, section: "BSMarketing-4A" },
  { courseId: 3, yearLevel: 4, section: "BSMarketing-4B" },
  { courseId: 3, yearLevel: 4, section: "BSMarketing-4C" },
  { courseId: 3, yearLevel: 4, section: "BSMarketing-4D" },
  { courseId: 3, yearLevel: 4, section: "BSMarketing-4E" },
  { courseId: 3, yearLevel: 4, section: "BSMarketing-4F" },
  { courseId: 3, yearLevel: 4, section: "BSMarketing-4G" },
  { courseId: 3, yearLevel: 4, section: "BSMarketing-4H" },
  { courseId: 3, yearLevel: 4, section: "BSMarketing-4I" },

  // BSE Sections (courseId: 4)
  { courseId: 4, yearLevel: 1, section: "BSE-1A" },
  { courseId: 4, yearLevel: 1, section: "BSE-1B" },
  { courseId: 4, yearLevel: 1, section: "BSE-1C" },
  { courseId: 4, yearLevel: 2, section: "BSE-2A" },
  { courseId: 4, yearLevel: 2, section: "BSE-2B" },
  { courseId: 4, yearLevel: 2, section: "BSE-2C" },
  { courseId: 4, yearLevel: 2, section: "BSE-2D" },
  { courseId: 4, yearLevel: 2, section: "BSE-2E" },
  { courseId: 4, yearLevel: 2, section: "BSE-2F" },
  { courseId: 4, yearLevel: 2, section: "BSE-2G" },
  { courseId: 4, yearLevel: 2, section: "BSE-2H" },
  { courseId: 4, yearLevel: 3, section: "BSE-3A" },
  { courseId: 4, yearLevel: 3, section: "BSE-3B" },
  { courseId: 4, yearLevel: 3, section: "BSE-3C" },
  { courseId: 4, yearLevel: 3, section: "BSE-3D" },
  { courseId: 4, yearLevel: 4, section: "BSE-4A" },
  { courseId: 4, yearLevel: 4, section: "BSE-4B" },
  { courseId: 4, yearLevel: 4, section: "BSE-4C" },
  { courseId: 4, yearLevel: 4, section: "BSE-4D" },
  { courseId: 4, yearLevel: 4, section: "BSE-4E" },
  { courseId: 4, yearLevel: 4, section: "BSE-4F" },
  { courseId: 4, yearLevel: 4, section: "BSE-4G" },
  { courseId: 4, yearLevel: 4, section: "BSE-4H" },

  // BS Public Administration Sections (courseId: 5)
  { courseId: 5, yearLevel: 1, section: "BSPublicAdministration-1A" },
  { courseId: 5, yearLevel: 1, section: "BSPublicAdministration-1B" },
  { courseId: 5, yearLevel: 1, section: "BSPublicAdministration-1C" },
  { courseId: 5, yearLevel: 1, section: "BSPublicAdministration-1D" },
  { courseId: 5, yearLevel: 2, section: "BSPublicAdministration-2A" },
  { courseId: 5, yearLevel: 2, section: "BSPublicAdministration-2B" },
  { courseId: 5, yearLevel: 2, section: "BSPublicAdministration-2C" },
  { courseId: 5, yearLevel: 2, section: "BSPublicAdministration-2D" },
  { courseId: 5, yearLevel: 2, section: "BSPublicAdministration-2E" },
  { courseId: 5, yearLevel: 2, section: "BSPublicAdministration-2F" },
  { courseId: 5, yearLevel: 2, section: "BSPublicAdministration-2G" },
  { courseId: 5, yearLevel: 3, section: "BSPublicAdministration-3A" },
  { courseId: 5, yearLevel: 3, section: "BSPublicAdministration-3B" },
  { courseId: 5, yearLevel: 3, section: "BSPublicAdministration-3C" },
  { courseId: 5, yearLevel: 3, section: "BSPublicAdministration-3D" },
  { courseId: 5, yearLevel: 3, section: "BSPublicAdministration-3E" },
  { courseId: 5, yearLevel: 4, section: "BSPublicAdministration-4A" },
  { courseId: 5, yearLevel: 4, section: "BSPublicAdministration-4B" },
  { courseId: 5, yearLevel: 4, section: "BSPublicAdministration-4C" },
  { courseId: 5, yearLevel: 4, section: "BSPublicAdministration-4D" },
  { courseId: 5, yearLevel: 4, section: "BSPublicAdministration-4E" },
  { courseId: 5, yearLevel: 4, section: "BSPublicAdministration-4F" },
  { courseId: 5, yearLevel: 4, section: "BSPublicAdministration-4G" },
];

async function main() {
  try {
    console.log("🌱 Seeding sections...");

    for (const section of seedStudentSections) {
      await db.insert(sections).values({
        sectionName: section.section,
        year: section.yearLevel,
        courseId: section.courseId,
      });
      console.log(`✅ Added section: ${section.section}`);
    }

    console.log("✅ Sections seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding sections:", error);
    process.exit(1);
  }
}

main();
