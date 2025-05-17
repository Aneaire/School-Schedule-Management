"use server";

import { courses } from "~/lib/schema";
import { db } from "~/lib/tursoDb";

export async function getAllCourses() {
  try {
    const allCourses = await db.select().from(courses);
    return allCourses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}
