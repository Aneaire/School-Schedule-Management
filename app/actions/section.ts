"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/lib/db";
import { sections } from "~/lib/schema";

export async function createSection({
  sectionName,
  year,
  courseId,
}: {
  sectionName: string;
  year: number;
  courseId: number;
}) {
  try {
    await db.insert(sections).values({
      sectionName,
      year,
      courseId,
    });
    revalidatePath("/additional");
    return { success: true };
  } catch (error) {
    console.error("Error creating section:", error);
    return { success: false, error: "Failed to create section" };
  }
}

export async function getAllSections() {
  try {
    const allSections = await db.select().from(sections);
    return allSections;
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
}
