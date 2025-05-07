"use server";

import { db } from "~/lib/db";
import { courses } from "~/lib/schema";

export async function getAllCourses() {
  try {
    const allCourses = await db.select().from(courses);
    return allCourses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}
