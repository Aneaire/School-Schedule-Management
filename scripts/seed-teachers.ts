import { db } from "~/lib/db";
import { teachers } from "~/lib/schema";

const seedTeachers = [
  {
    teacherName: "Prof. Garcia",
    email: "prof.garcia@university.edu",
    majorSubject: "Law",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Garcia",
  },
  {
    teacherName: "Prof. Reyes",
    email: "prof.reyes@university.edu",
    majorSubject: "Finance",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Reyes",
  },
  {
    teacherName: "Prof. Santos",
    email: "prof.santos@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santos",
  },
  {
    teacherName: "Prof. Cruz",
    email: "prof.cruz@university.edu",
    majorSubject: "Math",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cruz",
  },
  {
    teacherName: "Prof. Bautista",
    email: "prof.bautista@university.edu",
    majorSubject: "Accounting",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bautista",
  },
  {
    teacherName: "Prof. Rivera",
    email: "prof.rivera@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera",
  },
  {
    teacherName: "Prof. Lopez",
    email: "prof.lopez@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lopez",
  },
  {
    teacherName: "Prof. Martinez",
    email: "prof.martinez@university.edu",
    majorSubject: "Math",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martinez",
  },
  {
    teacherName: "Prof. Gomez",
    email: "prof.gomez@university.edu",
    majorSubject: "Finance",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gomez",
  },
  {
    teacherName: "Prof. Torres",
    email: "prof.torres@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Torres",
  },
  {
    teacherName: "Prof. Flores",
    email: "prof.flores@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Flores",
  },
  {
    teacherName: "Prof. Ramos",
    email: "prof.ramos@university.edu",
    majorSubject: "Law",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramos",
  },
  {
    teacherName: "Prof. Gonzales",
    email: "prof.gonzales@university.edu",
    majorSubject: "Math",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gonzales",
  },
  {
    teacherName: "Prof. Salazar",
    email: "prof.salazar@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Salazar",
  },
  {
    teacherName: "Prof. Mendoza",
    email: "prof.mendoza@university.edu",
    majorSubject: "Marketing",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mendoza",
  },
  {
    teacherName: "Prof. Castro",
    email: "prof.castro@university.edu",
    majorSubject: "Accounting",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Castro",
  },
  {
    teacherName: "Prof. Navarro",
    email: "prof.navarro@university.edu",
    majorSubject: "Finance",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Navarro",
  },
  {
    teacherName: "Prof. Domingo",
    email: "prof.domingo@university.edu",
    majorSubject: "Law",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Domingo",
  },
  {
    teacherName: "Prof. Padilla",
    email: "prof.padilla@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Padilla",
  },
  {
    teacherName: "Prof. Silva",
    email: "prof.silva@university.edu",
    majorSubject: "Marketing",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Silva",
  },
  {
    teacherName: "Prof. Delos Santos",
    email: "prof.delossantos@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Delos Santos",
  },
  {
    teacherName: "Prof. Fernandez",
    email: "prof.fernandez@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fernandez",
  },
  {
    teacherName: "Prof. Perez",
    email: "prof.perez@university.edu",
    majorSubject: "Marketing",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Perez",
  },
  {
    teacherName: "Prof. Jimenez",
    email: "prof.jimenez@university.edu",
    majorSubject: "Accounting",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jimenez",
  },
  {
    teacherName: "Prof. Aguilar",
    email: "prof.aguilar@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aguilar",
  },
  {
    teacherName: "Prof. Villanueva",
    email: "prof.villanueva@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Villanueva",
  },
  {
    teacherName: "Prof. De Leon",
    email: "prof.deleon@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=De Leon",
  },
  {
    teacherName: "Prof. Rosales",
    email: "prof.rosales@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosales",
  },
  {
    teacherName: "Prof. Lagman",
    email: "prof.lagman@university.edu",
    majorSubject: "Finance",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lagman",
  },
  {
    teacherName: "Prof. Soriano",
    email: "prof.soriano@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Soriano",
  },
  {
    teacherName: "Prof. Espino",
    email: "prof.espino@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Espino",
  },
  {
    teacherName: "Prof. Alvarez",
    email: "prof.alvarez@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alvarez",
  },
  {
    teacherName: "Prof. Roxas",
    email: "prof.roxas@university.edu",
    majorSubject: "Law",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roxas",
  },
  {
    teacherName: "Prof. Tan",
    email: "prof.tan@university.edu",
    majorSubject: "Finance",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tan",
  },
  {
    teacherName: "Prof. Yap",
    email: "prof.yap@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yap",
  },
  {
    teacherName: "Prof. Lim",
    email: "prof.lim@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lim",
  },
  {
    teacherName: "Prof. Chua",
    email: "prof.chua@university.edu",
    majorSubject: "Marketing",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chua",
  },
  {
    teacherName: "Prof. Ong",
    email: "prof.ong@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ong",
  },
  {
    teacherName: "Prof. Sy",
    email: "prof.sy@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sy",
  },
  {
    teacherName: "Prof. Go",
    email: "prof.go@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Go",
  },
  {
    teacherName: "Prof. Velasco",
    email: "prof.velasco@university.edu",
    majorSubject: "Accounting",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Velasco",
  },
  {
    teacherName: "Prof. Carbonell",
    email: "prof.carbonell@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carbonell",
  },
  {
    teacherName: "Prof. Panganiban",
    email: "prof.panganiban@university.edu",
    majorSubject: "Marketing",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Panganiban",
  },
  {
    teacherName: "Prof. Galang",
    email: "prof.galang@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Galang",
  },
];

async function main() {
  try {
    console.log("Seeding teachers...");
    for (const teacher of seedTeachers) {
      await db.insert(teachers).values(teacher);
      console.log(`Added teacher: ${teacher.teacherName}`);
    }
    console.log("Teachers seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding teachers:", error);
    process.exit(1);
  }
}

main();
