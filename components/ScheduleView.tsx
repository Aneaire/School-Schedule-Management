import { useQuery } from "@tanstack/react-query";
import { Calendar, Download, Loader2, Search, Table } from "lucide-react"; // Import Download icon
import { useState } from "react";
import { Button } from "~/components/ui/button";
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
import ScheduleDialogTable from "./ScheduleDialogTable"; // Assuming this is in the same directory or accessible path

// Define the Schedule interface (consistent with API response)
type Schedule = {
  scheduleId: number;
  subjectId: number; // Include subjectId as it might be useful
  subjectName: string;
  dayId: number; // Include dayId
  dayName: string;
  timeId: number; // Include timeId
  startTime: string;
  endTime: string;
  roomId: number; // Include roomId
  roomCode: string; // Ensure API returns roomCode
  roomName: string; // Ensure API returns roomName
  teacherName: string; // Ensure API returns teacherName
  sectionId: number; // Include sectionId
  sectionName: string; // Ensure API returns sectionName
  year: number; // Include year
};

interface ScheduleViewProps {
  teacherId: number;
  initialSchedules?: Schedule[]; // Use the defined Schedule type
}

export default function ScheduleView({
  teacherId,
  initialSchedules = [],
}: ScheduleViewProps) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  // Use the Schedule type for the query data
  const { data: schedules = initialSchedules, isLoading } = useQuery<
    Schedule[]
  >({
    queryKey: ["schedules", teacherId],
    queryFn: async () => {
      const res = await fetch(`/api/teachers/${teacherId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch schedules");
      }
      const data = await res.json();
      // Ensure the fetched data matches the Schedule type structure
      return data.schedules as Schedule[];
    },
    initialData: initialSchedules,
  });

  // Filter and search logic
  const filteredSchedules =
    schedules?.filter((schedule: Schedule) => {
      // Use Schedule type
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

  // Calculate duration in minutes (keeping this helper)
  const getDuration = (startTime: string, endTime: string): number => {
    // Use string types
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return endMinutes - startMinutes;
  };

  // Function to handle the Excel download
  const handleDownloadExcel = () => {
    if (teacherId) {
      // Call the backend API endpoint for exporting Excel with the teacher ID
      // Note: You might need to update your /api/export/schedules endpoint
      // to accept teacherId as a query parameter and filter accordingly.
      // As of our last implementation, it filters by sectionId or roomId.
      // Let's assume you update the backend to handle teacherId.
      window.open(`/api/export/schedules?teacherId=${teacherId}`, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Use type assertion for schedules in the check below
  if (!schedules || (schedules as Schedule[]).length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No schedules found
      </Card>
    );
  }

  return (
    <>
      <div className="max-w-md mx-auto bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          {" "}
          {/* Added flex layout */}
          <h2 className="text-lg font-semibold flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            Schedule View
          </h2>
          {/* Download as Excel Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownloadExcel} // Call the new handler
            className="text-gray-500 hover:text-green-500"
            aria-label="Download Schedule as Excel"
          >
            <Download className="h-5 w-5" />
          </Button>
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

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setOpenDialog(true)}
          >
            <Table className="w-4 h-4 mr-2" />
            View Weekly Table
          </Button>

          {/* Schedule list */}
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map(
                (
                  schedule: Schedule // Use Schedule type
                ) => (
                  // Assuming ScheduleCard expects a prop named 'schedule' of type Schedule
                  <ScheduleCard key={schedule.scheduleId} schedule={schedule} />
                )
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-muted-foreground/70" />
                <p className="text-sm">No schedules found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Pass schedules with the defined type */}
      <ScheduleDialogTable
        open={openDialog}
        onOpenChange={setOpenDialog}
        schedules={schedules as Schedule[]} // Assert type
      />
    </>
  );
}
