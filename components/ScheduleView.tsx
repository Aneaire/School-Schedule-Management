import { useQuery } from "@tanstack/react-query";
import { Calendar, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import ScheduleCard from "./ScheduleCard";

type Schedule = {
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
  teacherName?: string;
  sectionId: number;
  sectionName: string;
  year: number;
};

interface ScheduleViewProps {
  teacherId: number;
  initialSchedules?: any[];
}

export default function ScheduleView({
  teacherId,
  initialSchedules = [],
}: ScheduleViewProps) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: schedules = initialSchedules, isLoading } = useQuery({
    queryKey: ["schedules", teacherId],
    queryFn: async () => {
      const res = await fetch(`/api/teachers/${teacherId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch schedules");
      }
      const data = await res.json();
      return data.schedules;
    },
    initialData: initialSchedules,
  });

  // Filter and search logic
  const filteredSchedules =
    schedules?.filter((schedule: any) => {
      const matchesSearch =
        searchQuery === "" ||
        schedule.subjectName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (schedule.teacherName &&
          schedule.teacherName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        schedule.roomName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filter === "all" || schedule.dayName.toLowerCase() === filter;

      return matchesSearch && matchesFilter;
    }) || [];

  // Calculate duration in minutes
  const getDuration = (startTime: any, endTime: any) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return endMinutes - startMinutes;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!schedules || schedules.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No schedules found
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-card rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary" />
          Schedule View
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Search and filter controls */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search schedules..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Days</SelectItem>
              <SelectItem value="monday">Monday</SelectItem>
              <SelectItem value="tuesday">Tuesday</SelectItem>
              <SelectItem value="wednesday">Wednesday</SelectItem>
              <SelectItem value="thursday">Thursday</SelectItem>
              <SelectItem value="friday">Friday</SelectItem>
              <SelectItem value="saturday">Saturday</SelectItem>
              <SelectItem value="sunday">Sunday</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Schedule list */}
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule: any) => (
              <ScheduleCard key={schedule.scheduleId} schedule={schedule} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-muted-foreground/70" />
              <p className="text-sm">No schedules found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
