"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Award, BookOpen, Calendar, Mail } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AssignSubjectForm from "~/components/AssignSubjectForm";
import ScheduleView from "~/components/ScheduleView";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

type TeacherProfile = {
  teacherId: number;
  teacherName: string;
  email: string;
  imageUrl?: string;
  majorSubject: string;
  schedules: {
    scheduleId: number;
    subjectId: number;
    subjectName: string;
    dayId: number;
    dayName: string;
    timeId: number;
    startTime: string;
    endTime: string;
    roomId: number;
    roomName: string;
    sectionId: number;
    sectionName: string;
    year: number;
  }[];
};

const queryClient = new QueryClient();

export default function Teacher() {
  const params = useParams();
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await fetch(`/api/teachers/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setTeacher(data);
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch teacher", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchTeacher();
  }, [params.id]);
  console.log("teacher", teacher);
  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((part) => part[0])
          .join("")
      : "??";
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-16 p-6">
        <div className="flex items-center space-x-4 mb-8">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="max-w-3xl mx-auto mt-16 p-6 text-center">
        <div className="bg-red-50 text-red-800 p-6 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold mb-2">Teacher Not Found</h2>
          <p>We couldn't find the teacher profile you're looking for.</p>
        </div>
      </div>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-3xl mx-auto mt-12 px-4 md:px-0">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <div className="px-6 -mt-16 pb-4 relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              {teacher.imageUrl ? (
                <AvatarImage
                  className="object-cover"
                  src={teacher.imageUrl}
                  alt={teacher.teacherName}
                />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                  {getInitials(teacher.teacherName)}
                </AvatarFallback>
              )}
            </Avatar>

            <CardHeader className="pt-8 px-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {teacher.teacherName}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2" />
                    {teacher.email}
                  </CardDescription>
                  <CardDescription className="flex items-center mt-1">
                    <Award className="w-4 h-4 mr-2" />
                    Specialization : {teacher.majorSubject}
                  </CardDescription>
                </div>
                <div className="mt-4 md:mt-0">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    Faculty Member
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-0 py-4">
              <Tabs defaultValue="schedule" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger
                    value="schedule"
                    className="flex items-center justify-center"
                  >
                    <Calendar className="w-4 h-4 mr-2" /> Schedule
                  </TabsTrigger>
                  <TabsTrigger
                    value="add"
                    className="flex items-center justify-center"
                  >
                    <BookOpen className="w-4 h-4 mr-2" /> Assign Subject
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="schedule" className="space-y-4">
                  <ScheduleView
                    teacherId={teacher.teacherId}
                    initialSchedules={teacher.schedules as any[]}
                  />
                </TabsContent>

                <TabsContent value="add">
                  <AssignSubjectForm
                    teacherId={teacher.teacherId}
                    teacherName={teacher.teacherName}
                    majorSubject={teacher.majorSubject}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </div>
        </Card>
      </div>
    </QueryClientProvider>
  );
}
