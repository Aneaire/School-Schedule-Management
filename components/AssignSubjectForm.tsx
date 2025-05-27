// components/AssignSubjectForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Clock, Loader2, School, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { formatTimeTo12Hour, formatTimeTo12Hour2, HOURS } from "~/utils/time";
import ScheduleConflictDialog from "./ScheduleConflictDialog";

type Conflict = {
  teacherName: string;
  subjectName: string;
  roomName: string;
  conflictStartHour: string;
  conflictEndHour: string;
};

type Conflicts = {
  room: Conflict[];
  section: Conflict[];
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Schema to use duration in minutes (e.g., 15 to 720)
const assignSchema = z.object({
  subjectId: z.string().min(1, "Select a subject"),
  roomId: z.string().min(1, "Select a room"),
  day: z.string().min(1, "Select a day"),
  startHour: z
    .number({ invalid_type_error: "Start hour is required" })
    .min(7, "Earliest hour is 7")
    .max(19, "Latest hour is 19"),
  duration: z
    .number({ invalid_type_error: "Duration is required" })
    .min(30, "Minimum 30 minutes")
    .max(300, "Maximum 5 hours")
    .refine((val) => val % 30 === 0, {
      message: "Duration must be in 30-minute increments",
    }),
  sectionId: z.string().min(1, "Select a section"),
});

type AssignFormData = z.infer<typeof assignSchema>;
type Subject = { subjectId: number; subjectName: string };
type Room = { roomId: number; roomCode: string; roomName: string };
type Section = { sectionId: number; sectionName: string; year: number };

function formatHourTo12Hour(hour: number): string {
  const h = Math.floor(hour) % 12 || 12;
  const minute = (hour % 1) * 60;
  const ampm = hour < 12 || hour === 24 ? "AM" : "PM";
  return `${h}:${minute < 10 ? "0" + minute : minute} ${ampm}`;
}

export default function AssignSubjectForm({
  majorSubject,
  teacherName,
  teacherId,
}: {
  majorSubject: string;
  teacherName: string;
  teacherId: number;
}) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [conflicts, setConflicts] = useState<Conflicts | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [suggestedSlots, setSuggestedSlots] = useState<
    { day: string; hour: number }[]
  >([]);
  const [teacherSchedules, setTeacherSchedules] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [roomDaySchedules, setRoomDaySchedules] = useState<any[]>([]);
  const [sectionDaySchedules, setSectionDaySchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<AssignFormData>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      roomId: "",
      subjectId: "",
      sectionId: "",
      startHour: 7,
      duration: 60,
      day: "Monday",
    },
  });

  const selectedRoomId = form.watch("roomId");
  const selectedDay = form.watch("day");
  const selectedSectionId = form.watch("sectionId");

  // Mutation for assigning subject
  const assignSubjectMutation = useMutation({
    mutationFn: async (data: AssignFormData) => {
      const res = await fetch(`/api/teachers/${teacherId}/assign-subject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          subjectId: Number(data.subjectId),
          roomId: Number(data.roomId),
          sectionId: Number(data.sectionId),
          teacherId,
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        if (result.conflicts) {
          setConflicts(result.conflicts);
          console.log("Schedule conflict detected", result.conflicts);
          setShowDialog(true);
          throw new Error("Schedule conflict detected");
        }
        throw new Error(result.error || "Failed to assign subject");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Subject assigned successfully!");
      setSuccessMessage("Subject has been assigned successfully!");
      form.reset();
      setConflicts(null);
      setShowDialog(false);
      // Invalidate and refetch schedules
      queryClient.invalidateQueries({ queryKey: ["schedules", teacherId] });
    },
    onError: (error: Error) => {
      if (error.message !== "Schedule conflict detected") {
        toast.error(
          error.message || "An error occurred while assigning the subject"
        );
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          roomsResponse,
          subjectsResponse,
          sectionsResponse,
          schedulesResponse,
        ] = await Promise.all([
          fetch("/api/rooms").then((res) => res.json()),
          fetch("/api/subjects").then((res) => res.json()),
          fetch("/api/sections").then((res) => res.json()),
          fetch(
            `/api/teachers/schedules?teacherId=${teacherId}&day=${selectedDay}`
          ).then((res) => res.json()),
        ]);

        setRooms(roomsResponse);
        setSubjects(subjectsResponse);
        setSections(sectionsResponse);
        setTeacherSchedules(schedulesResponse);

        const defaultSubject = subjectsResponse.find(
          (s: Subject) => s.subjectName === majorSubject
        );
        if (defaultSubject) {
          form.setValue("subjectId", defaultSubject.subjectId.toString());
        }
      } catch (error) {
        toast.error("Failed to load form data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [majorSubject, form.setValue]);

  // Fetch schedules for the selected room and day
  useEffect(() => {
    if (selectedRoomId && selectedDay) {
      fetch(
        `/api/teachers/schedules?roomId=${selectedRoomId}&day=${selectedDay}`
      )
        .then((res) => res.json())
        .then((data) => setRoomDaySchedules(data))
        .catch(() => toast.error("Failed to load room schedules"));
    } else {
      setRoomDaySchedules([]);
    }
  }, [selectedRoomId, selectedDay]);

  // Fetch schedules for the selected section and day
  useEffect(() => {
    if (selectedSectionId && selectedDay) {
      fetch(
        `/api/teachers/schedules?sectionId=${selectedSectionId}&day=${selectedDay}`
      )
        .then((res) => res.json())
        .then((data) => setSectionDaySchedules(data))
        .catch(() => toast.error("Failed to load section schedules"));
    } else {
      setSectionDaySchedules([]);
    }
  }, [selectedSectionId, selectedDay]);

  // Fetch teacher schedules for the selected day
  useEffect(() => {
    console.log("bulshit", teacherId);
    if (teacherId && selectedDay) {
      fetch(`/api/teachers/schedules?teacherId=${teacherId}&day=${selectedDay}`)
        .then((res) => res.json())
        .then((data) => setTeacherSchedules(data))
        .catch(() => toast.error("Failed to load teacher schedules"));
    } else {
      setTeacherSchedules([]);
    }
  }, [teacherId, selectedDay]);

  const onSubmit = async (data: AssignFormData) => {
    assignSubjectMutation.mutate(data);
  };

  const onSlotSelect = (hour: number) => {
    form.setValue("startHour", hour);
    setShowDialog(false);
  };

  const onDayChange = (day: string) => {
    form.setValue("day", day);
    setShowDialog(false);
  };

  const onDurationChange = (duration: number) => {
    form.setValue("duration", duration);
    setShowDialog(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-muted-foreground">
          Loading form data...
        </span>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-md mx-auto">
      <CardHeader className="space-y-1 py-2 bg-muted/50">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">
            Assignment Form
          </CardTitle>
        </div>
        <CardDescription>
          Assign a subject to{" "}
          <span className="font-medium text-primary">{teacherName}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <School className="h-4 w-4 text-primary" />
                      Subject
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem
                            key={s.subjectId}
                            value={s.subjectId.toString()}
                          >
                            {s.subjectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sectionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Section
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem
                            key={section.sectionId}
                            value={section.sectionId.toString()}
                          >
                            <span className="font-medium">
                              {section.sectionName}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              - Year {section.year}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Room
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem
                            key={room.roomId}
                            value={room.roomId.toString()}
                          >
                            <span className="font-medium">{room.roomCode}</span>
                            <span className="text-muted-foreground">
                              {" "}
                              - {room.roomName}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        Day
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DAYS.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Start Time
                      </FormLabel>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(v) => field.onChange(parseFloat(v))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {HOURS.map((hour) => (
                            <SelectItem key={hour} value={hour.toString()}>
                              {formatTimeTo12Hour2(hour)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Duration (minutes)
                    </FormLabel>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(v) => field.onChange(parseInt(v))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[60, 90, 120, 150, 180, 210, 240, 270, 300].map(
                          (minutes) => (
                            <SelectItem
                              key={minutes}
                              value={minutes.toString()}
                            >
                              {minutes} minutes ({Math.floor(minutes / 60)}h{" "}
                              {minutes % 60 === 0 ? "" : "30m"})
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Select duration in 30-minute increments, up to 5 hours
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

            {selectedRoomId && selectedDay && selectedSectionId && (
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Existing schedules:
                </p>
                <div className="space-y-4">
                  {roomDaySchedules.length > 0 ? (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Room schedules:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {roomDaySchedules.map((schedule, index) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="px-2 py-1">
                                  {formatTimeTo12Hour(schedule.startTime)} -{" "}
                                  {formatTimeTo12Hour(schedule.endTime)}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{schedule.subjectName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Teacher: {schedule.teacherName}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Room schedules:{" "}
                        <span className="text-green-500">✓</span>
                      </p>
                    </div>
                  )}
                  {sectionDaySchedules.length > 0 ? (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Section schedules:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {sectionDaySchedules.map((schedule, index) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="px-2 py-1">
                                  {formatTimeTo12Hour(schedule.startTime)} -{" "}
                                  {formatTimeTo12Hour(schedule.endTime)}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{schedule.subjectName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Teacher: {schedule.teacherName}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Section schedules:{" "}
                        <span className="text-green-500">✓</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {teacherSchedules.length > 0 ? (
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Teacher schedules:
                </p>
                <div className="flex flex-wrap gap-2">
                  {teacherSchedules.map((schedule, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="px-2 py-1">
                            {formatTimeTo12Hour(schedule.startTime)} -{" "}
                            {formatTimeTo12Hour(schedule.endTime)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{schedule.subjectName}</p>
                          <p className="text-xs text-muted-foreground">
                            Room: {schedule.roomName}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Teacher schedules: <span className="text-green-500">✓</span>
                </p>
              </div>
            )}

            <CardFooter className="flex justify-end p-0 pt-4">
              <Button
                type="submit"
                disabled={assignSubjectMutation.isPending}
                className="w-full"
              >
                {assignSubjectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  "Assign Subject"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>

      <ScheduleConflictDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        conflicts={conflicts}
        onSlotSelect={onSlotSelect}
        onDayChange={onDayChange}
        onDurationChange={onDurationChange}
        roomId={selectedRoomId}
        day={selectedDay}
        duration={form.watch("duration")}
      />
    </Card>
  );
}
