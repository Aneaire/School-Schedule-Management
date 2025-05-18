// TeacherDashboard with skeleton loader and infinite scroll (without TanStack Query)
"use client";

import { Book, Bookmark, Mail, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
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

const PAGE_SIZE = 9;

interface Teacher {
  teacherId: number;
  teacherName: string;
  email: string;
  imageUrl: string;
  majorSubject: string;
}

export default function TeacherDashboard() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      const res = await fetch(`/api/teachers?page=${page}&limit=${PAGE_SIZE}`);
      const json = await res.json();

      if (json.data.length < PAGE_SIZE) setHasMore(false);
      setTeachers((prev) =>
        prev.concat(
          json.data.filter(
            (t: Teacher) => !prev.some((p) => p.teacherId === t.teacherId)
          )
        )
      );
      setLoading(false);
    };

    if (hasMore) fetchTeachers();
  }, [page]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore, loading]);

  const allSubjects = useMemo(() => {
    return [...new Set(teachers.map((t) => t.majorSubject))].sort();
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearch =
        teacher.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject
        ? teacher.majorSubject === selectedSubject
        : true;
      return matchesSearch && matchesSubject;
    });
  }, [teachers, searchTerm, selectedSubject]);

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
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <main className="flex-1 container mx-auto px-6 pt-3 pb-1">
        <div className="mb-4 max-w-md ml-auto">
          <div className="sm:flex hidden items-center gap-2">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search teachers..."
                className="w-full bg-gray-800 border-gray-700 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link href="/additional">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto w-full">
                + Add More
              </Button>
            </Link>
          </div>
          <div className="sm:hidden flex gap-2 w-full">
            <div className="relative w-full flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search teachers..."
                className="w-full bg-gray-800 border-gray-700 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>{" "}
            <Link href="/additional">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                +
              </Button>
            </Link>
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
        </div>

        {loading && page === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
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
                <Skeleton className="h-4 w-2/3" />
              </Card>
            ))}
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Book className="mx-auto h-12 w-12 mb-4 opacity-30" />
            <h3 className="text-xl font-medium">No teachers found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
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
                    <Bookmark className="text-gray-400 hover:text-purple-400" />
                  </div>
                </CardHeader>
                <CardFooter className="pt-1 border-t border-gray-700">
                  <div className="flex justify-between w-full text-sm">
                    <span className="text-gray-400 flex items-center">
                      <Book className="h-4 w-4 mr-1" />
                      Specialization:
                      <Badge className="bg-gray-700 ml-1 text-gray-300">
                        {teacher.majorSubject}
                      </Badge>
                    </span>
                    <button
                      onClick={() =>
                        router.push(`/teachers/${teacher.teacherId}`)
                      }
                      className="text-purple-400 flex items-center hover:text-purple-300"
                    >
                      <Sparkles className="h-4 w-4 mr-1" /> View Profile
                    </button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        {hasMore && !loading && (
          <div ref={ref} className="text-center mt-6 text-sm text-gray-500">
            Loading more teachers...
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 py-6 bg-gray-900">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          &copy; 2025 FacultyHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
