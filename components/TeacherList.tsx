// components/TeacherList.tsx - Corrected file
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Book, ClipboardCopy, Mail, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Toaster } from "./ui/sonner";

const PAGE_SIZE = 9;

// Update Teacher interface to include employeeId
interface Teacher {
  teacherId: number;
  employeeId: string; // Added employeeId
  teacherName: string;
  email: string;
  imageUrl: string;
  majorSubject: string;
  subjects?: { subjectId: number; subjectName: string }[]; // Keep subjects as it's fetched by the API
}

// Modify fetchTeachers to accept searchTerm and selectedSubject
async function fetchTeachers({ pageParam = 1, searchTerm = "" }): Promise<{
  data: Teacher[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const url = new URL(`/api/teachers`, window.location.origin);
  url.searchParams.append("page", pageParam.toString());
  url.searchParams.append("limit", PAGE_SIZE.toString());
  if (searchTerm) {
    url.searchParams.append("searchTerm", searchTerm);
  }
  // The API currently filters by searchTerm (name, email, employeeId).
  // Client-side filtering is still needed for majorSubject.

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Failed to fetch teachers");
  }
  return res.json();
}

export default function TeacherList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const router = useRouter();
  const { ref, inView } = useInView();

  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    error,
    isLoading,
    data,
    isFetching, // Added isFetching to indicate any fetching activity
  } = useInfiniteQuery({
    // Include searchTerm and selectedSubject in the queryKey
    queryKey: ["teachers", searchTerm, selectedSubject],
    queryFn: ({ pageParam = 1 }) => fetchTeachers({ pageParam, searchTerm }), // No longer pass selectedSubject here
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.pageSize);
      if (lastPage.page < totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return undefined;
    },
  });

  // Effect for infinite scrolling
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, isFetching]);

  // Flatten pages into one array and apply client-side filtering for majorSubject
  const teachers = useMemo(() => {
    if (!data) return [];
    // Flatten pages
    const allFetchedTeachers = data.pages.flatMap((page: any) => page.data);

    // Apply client-side filtering for majorSubject
    return allFetchedTeachers.filter((teacher) =>
      selectedSubject ? teacher.majorSubject === selectedSubject : true
    );
  }, [data, selectedSubject]); // Depend on data and selectedSubject

  // Recalculate allSubjects based on *all* fetched data (before client-side filtering)
  const allSubjects = useMemo(() => {
    if (!data) return [];
    const allFetchedTeachers = data.pages.flatMap((page: any) => page.data);
    // Filter out undefined or null subjects if necessary, though the schema suggests they are not null
    return [
      ...new Set(
        allFetchedTeachers
          .map((t) => t.majorSubject)
          .filter((subject) => subject !== null && subject !== undefined)
      ),
    ].sort();
  }, [data]);

  const getInitials = (name: string): string =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const getColorClass = (name: string): string => {
    const colors = [
      "bg-purple-600",
      "bg-blue-600",
      "bg-green-600",
      "bg-amber-600",
      "bg-red-600",
      "bg-pink-600",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % colors.length;
    return colors[index];
  };

  // Function to copy Employee ID to clipboard
  const copyEmployeeId = (employeeId: string) => {
    navigator.clipboard
      .writeText(employeeId)
      .then(() => {
        toast.info(`Copied Employee ID: ${employeeId}`);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy Employee ID.");
      });
  };

  // Show skeleton loaders if initially loading or fetching for a new search/filter resulting in no teachers
  const showSkeletons = isLoading || (isFetching && teachers.length === 0);
  // Show existing teachers while fetching *next* page OR if data is available after initial load
  const showTeachers = teachers.length > 0 && !isLoading;

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        Failed to load teachers: {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="mb-4 max-w-md ml-auto">
        <div className="flex items-center gap-2">
          <div className="relative w-full flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search name, email, or Employee ID..."
              className="w-full bg-gray-800 border-gray-700 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => router.push("/additional")}
            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          >
            <span className="sm:inline hidden">+ Add More</span>
            <span className="sm:hidden inline">+</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Badge
          className={`cursor-pointer text-sm px-3 py-1 ${
            !selectedSubject ? "bg-purple-600" : "bg-gray-700"
          }`}
          onClick={() => setSelectedSubject(null)}
        >
          All Subjects
        </Badge>
        {/* Render subject badges if allSubjects has data */}
        {allSubjects.map((subject) => (
          <Badge
            key={subject}
            className={`cursor-pointer text-sm px-3 py-1 ${
              selectedSubject === subject ? "bg-purple-600" : "bg-gray-700"
            }`}
            onClick={() => setSelectedSubject(subject)}
          >
            {subject}
          </Badge>
        ))}
        {/* Show skeleton subjects while loading if data is being fetched but no subjects loaded yet */}
        {/* Adjusted condition: only show skeletons if loading and no data (subjects) yet */}
        {isFetching &&
          allSubjects.length === 0 &&
          !isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full bg-gray-700" />
          ))}
      </div>

      {showSkeletons ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Card
              key={i}
              className="bg-gray-800 border-gray-700 p-4 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-4 w-1/3 mt-2" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-end pt-2 border-t border-gray-700">
                <Skeleton className="h-8 w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Book className="mx-auto h-12 w-12 mb-4 opacity-30" />
          <h3 className="text-xl font-medium">
            No teachers found matching your criteria.
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <Card
              key={teacher.teacherId}
              className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar
                      className={`h-12 w-12 ${getColorClass(
                        teacher.teacherName
                      )}`}
                    >
                      <AvatarImage src={teacher.imageUrl} />
                      <AvatarFallback>
                        {getInitials(teacher.teacherName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{teacher.teacherName}</CardTitle>
                      <CardDescription className="flex items-center text-gray-400">
                        <Mail className="h-3 w-3 mr-1 mt-1" />
                        {teacher.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="mr-1">#{teacher.employeeId}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Employee ID</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-gray-500 hover:text-white"
                      onClick={() => copyEmployeeId(teacher.employeeId)}
                      aria-label={`Copy Employee ID ${teacher.employeeId}`}
                    >
                      <ClipboardCopy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="pt-1 border-t border-gray-700 flex justify-between">
                <span className="text-gray-400 flex items-center text-sm">
                  <Book className="h-4 w-4 mr-1" />
                  Specialization:
                  <Badge className="bg-gray-700 ml-1 text-gray-300">
                    {teacher.majorSubject}
                  </Badge>
                </span>
                <button
                  onClick={() => router.push(`/teachers/${teacher.teacherId}`)}
                  className="text-purple-400 flex items-center hover:text-purple-300 text-sm"
                >
                  <Sparkles className="h-4 w-4 mr-1" /> View Profile
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Loading indicator for infinite scroll */}
      {isFetchingNextPage && (
        <div className="text-center mt-6 text-sm text-gray-500">
          Loading more teachers...
        </div>
      )}

      {/* Ref element for infinite scroll */}
      <div ref={ref} className="h-1"></div>

      {/* Message when all teachers are loaded for the current criteria */}
      {!hasNextPage && !isLoading && teachers.length > 0 && (
        <div className="text-center mt-6 text-sm text-gray-500">
          You've reached the end of the list.
        </div>
      )}
      {/* Adjust skeleton subjects loading condition to use isFetching */}
      {/* Removed previous skeleton subject logic */}
    </>
  );
}
