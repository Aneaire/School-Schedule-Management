"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getAllCourses } from "~/app/actions/course";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const formSchema = z.object({
  sectionName: z.string().min(1, "Section name is required"),
  year: z.string().min(1, "Year is required"),
  courseId: z.string().min(1, "Course is required"),
});

type Course = {
  courseId: number;
  courseName: string;
};

export default function AddSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const fetchedCourses = await getAllCourses();
      setCourses(fetchedCourses);
    };
    fetchCourses();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sectionName: "",
      year: "",
      courseId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      // Check if section already exists
      const checkResponse = await fetch(`/api/sections/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const checkResult = await checkResponse.json();

      if (checkResult.exists) {
        toast.error(
          "A section with this name and year already exists for this course"
        );
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to create section");
        return;
      }

      toast.success("Section created successfully!");
      setSuccessMessage("Section has been created successfully!");

      // Reset form
      form.reset();

      // Refresh the page data
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while creating the section");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="sectionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter section name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter year" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem
                      key={course.courseId}
                      value={course.courseId.toString()}
                    >
                      {course.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Add Section"}
        </Button>
      </form>
      {successMessage && (
        <div className="mt-4 text-center text-sm text-green-500">
          {successMessage}
        </div>
      )}
    </Form>
  );
}
