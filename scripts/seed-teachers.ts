import { teachers } from "~/lib/schema";
import { db } from "~/lib/tursoDb";

// Seed data for teachers - Update this array
const seedTeachers = [
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(), // Random 8-digit ID
    teacherName: "Prof. Garcia",
    email: "prof.garcia@university.edu",
    majorSubject: "Law",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Garcia",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Reyes",
    email: "prof.reyes@university.edu",
    majorSubject: "Finance",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Reyes",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Santos",
    email: "prof.santos@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santos",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Cruz",
    email: "prof.cruz@university.edu",
    majorSubject: "Math",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cruz",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Bautista",
    email: "prof.bautista@university.edu",
    majorSubject: "Accounting",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bautista",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Rivera",
    email: "prof.rivera@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Lopez",
    email: "prof.lopez@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lopez",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Martinez",
    email: "prof.martinez@university.edu",
    majorSubject: "Math",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martinez",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Gomez",
    email: "prof.gomez@university.edu",
    majorSubject: "Finance",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gomez",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Torres",
    email: "prof.torres@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Torres",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Flores",
    email: "prof.flores@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Flores",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Ramos",
    email: "prof.ramos@university.edu",
    majorSubject: "Law",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramos",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Gonzales",
    email: "prof.gonzales@university.edu",
    majorSubject: "Math",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gonzales",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Salazar",
    email: "prof.salazar@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Salazar",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Mendoza",
    email: "prof.mendoza@university.edu",
    majorSubject: "Marketing",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mendoza",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Castro",
    email: "prof.castro@university.edu",
    majorSubject: "Accounting",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Castro",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Navarro",
    email: "prof.navarro@university.edu",
    majorSubject: "Finance",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Navarro",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Domingo",
    email: "prof.domingo@university.edu",
    majorSubject: "Law",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Domingo",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Padilla",
    email: "prof.padilla@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Padilla",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Silva",
    email: "prof.silva@university.edu",
    majorSubject: "Marketing",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Silva",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Delos Santos",
    email: "prof.delossantos@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Delos Santos",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Fernandez",
    email: "prof.fernandez@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fernandez",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Perez",
    email: "prof.perez@university.edu",
    majorSubject: "Marketing",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Perez",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Jimenez",
    email: "prof.jimenez@university.edu",
    majorSubject: "Accounting",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jimenez",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Aguilar",
    email: "prof.aguilar@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aguilar",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Villanueva",
    email: "prof.villanueva@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Villanueva",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. De Leon",
    email: "prof.deleon@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=De Leon",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Rosales",
    email: "prof.rosales@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rosales",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Lagman",
    email: "prof.lagman@university.edu",
    majorSubject: "Finance",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lagman",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Soriano",
    email: "prof.soriano@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Soriano",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Espino",
    email: "prof.espino@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Espino",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Alvarez",
    email: "prof.alvarez@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alvarez",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Roxas",
    email: "prof.roxas@university.edu",
    majorSubject: "Law",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roxas",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Tan",
    email: "prof.tan@university.edu",
    majorSubject: "Finance",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tan",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Yap",
    email: "prof.yap@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yap",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Lim",
    email: "prof.lim@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lim",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Chua",
    email: "prof.chua@university.edu",
    majorSubject: "Marketing",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chua",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Ong",
    email: "prof.ong@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ong",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Sy",
    email: "prof.sy@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sy",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Go",
    email: "prof.go@university.edu",
    majorSubject: "Programming",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Go",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Velasco",
    email: "prof.velasco@university.edu",
    majorSubject: "Accounting",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Velasco",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Carbonell",
    email: "prof.carbonell@university.edu",
    majorSubject: "English",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carbonell",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
    teacherName: "Prof. Panganiban",
    email: "prof.panganiban@university.edu",
    majorSubject: "Marketing",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Panganiban",
  },
  {
    employeeId: Math.floor(10000000 + Math.random() * 90000000).toString(),
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
