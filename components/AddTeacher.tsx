"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UploadDropzone } from "~/utils/uploadthing";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Subject = {
  subjectId: number;
  subjectName: string;
};

const schema = z.object({
  teacherName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  majorSubject: z.string().min(1, "Please select a major subject"),
  imageUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddTeacher() {
  const [animationParent] = useAutoAnimate();
  const [imageSelected, setImageSelected] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      teacherName: "",
      email: "",
      majorSubject: "",
      imageUrl: "",
    },
  });

  // Fetch subjects using useQuery with options object
  const {
    data: subjectOptions = [],
    isLoading: subjectsLoading,
    error: subjectsError,
    refetch: refetchSubjects,
  } = useQuery<Subject[], Error>({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await fetch("/api/subjects");
      if (!res.ok) throw new Error("Failed to fetch subjects");
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Mutation for adding a teacher
  const { mutate, isPending: isUploading } = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to add teacher");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Teacher added successfully");
      setSuccessMessage("Teacher has been added successfully!");
      reset();
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add teacher");
    },
  });

  const onSubmit = (data: FormData) => {
    setSuccessMessage(null);
    mutate(data);
  };

  return (
    <div
      ref={animationParent}
      className="max-w-md mx-auto mt-10 p-6 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      <h1 className="text-2xl font-bold">Add New Teacher</h1>
      <div>
        <Label>Profile picture (optional)</Label>
        <p className="text-sm text-gray-500">
          Upload an image before clicking "Add Teacher"
        </p>
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            setValue("imageUrl", res[0].ufsUrl);
            setImageSelected(false);
          }}
          onUploadError={(error: Error) => {
            console.error("Upload failed:", error);
            toast.error("Failed to upload image");
          }}
          onChange={(files) => {
            setImageSelected(files.length > 0);
          }}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="teacherName">Name</Label>
          <Input
            id="teacherName"
            {...register("teacherName")}
            placeholder="Michael Bee.."
          />
          {errors.teacherName && (
            <p className="text-red-500 text-sm">{errors.teacherName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="michaelbee@gmail.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="majorSubject">Major Subject</Label>
          <select
            id="majorSubject"
            {...register("majorSubject")}
            className="w-full p-2 border rounded-md bg-white text-black dark:bg-gray-800 dark:text-white"
            defaultValue=""
            disabled={subjectsLoading}
          >
            <option value="" disabled>
              {subjectsLoading ? "Loading subjects..." : "Select one subject"}
            </option>
            {subjectOptions.map((subject) => (
              <option key={subject.subjectId} value={subject.subjectName}>
                {subject.subjectName}
              </option>
            ))}
          </select>
          {errors.majorSubject && (
            <p className="text-red-500 text-sm">
              {errors.majorSubject.message}
            </p>
          )}
          {subjectsError && (
            <p className="text-red-500 text-sm mt-1">
              Failed to load subjects: {subjectsError.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isUploading || imageSelected}
        >
          {isUploading
            ? "Adding..."
            : imageSelected
            ? "Click Upload First 👆"
            : "Add Teacher"}
        </Button>
      </form>
      {successMessage && (
        <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p>{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
