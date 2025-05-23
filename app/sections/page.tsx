"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  Book,
  Bookmark,
  Calendar,
  Clock,
  LayoutGrid,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ScheduleDialogTable from "~/components/ScheduleDialogTable";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";

// Import the ScheduleDialogTable component

interface Section {
  sectionId: number;
  sectionName: string;
  year: number;
  courseId: number;
}

interface Schedule {
  subjectName: string;
  startTime: string;
  endTime: string;
  dayName: string;
  teacherName: string;
  roomCode: string;
}

const SectionsPage = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  // New state to control the ScheduleDialogTable visibility
  const [showTableDialog, setShowTableDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogLoading, setIsDialogLoading] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const router = useRouter();
  const [animationParent] = useAutoAnimate();

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/sections")
      .then((res) => res.json())
      .then((data) => {
        setSections(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  const openScheduleDialog = async (section: Section) => {
    try {
      setIsDialogLoading(true);
      setDialogOpen(true);
      setSelectedSection(section);
      const res = await fetch(`/api/schedules?sectionId=${section.sectionId}`);
      const data = await res.json();
      setSchedules(data);
    } catch (err) {
      console.error("Failed to fetch schedule", err);
    } finally {
      setIsDialogLoading(false);
    }
  };

  const allYears = [...new Set(sections.map((section) => section.year))].sort();

  const filteredSections = sections.filter((section) => {
    const matchesSearch = section.sectionName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesYear = selectedYear ? section.year === selectedYear : true;
    return matchesSearch && matchesYear;
  });

  const groupSchedulesByDay = () => {
    const grouped: { [key: string]: Schedule[] } = schedules.reduce(
      (acc, schedule) => {
        if (!acc[schedule.dayName]) {
          acc[schedule.dayName] = [];
        }
        acc[schedule.dayName].push(schedule);
        return acc;
      },
      {} as { [key: string]: Schedule[] }
    );

    return Object.entries(grouped).sort((a, b) => {
      const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      return days.indexOf(a[0]) - days.indexOf(b[0]);
    });
  };

  const groupedSchedules = groupSchedulesByDay();

  // Function to close the main dialog and open the table dialog
  const handleViewTableClick = () => {
    setDialogOpen(false); // Close the list view dialog
    setShowTableDialog(true); // Open the table view dialog
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <main className="flex-1 container mx-auto px-6 pt-3 pb-1">
        {/* ... (rest of your main content - search, year filters, sections list) ... */}
        <div className="mb-4 max-w-md ml-auto">
          <div className="sm:flex hidden items-center gap-2">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search sections..."
                className="w-full bg-gray-800 border-gray-700 pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link href="/additional?tab=section">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto w-full">
                + Add Section
              </Button>
            </Link>
          </div>
          <div className="sm:hidden flex gap-2 w-full">
            <div className="relative w-full flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search sections..."
                className="w-full bg-gray-800 border-gray-700 pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link href="/add-section">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                +
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <Badge
            className={`cursor-pointer text-sm px-3 py-1 ${
              !selectedYear ? "bg-purple-600" : "bg-gray-700"
            }`}
            onClick={() => setSelectedYear(null)}
          >
            All Years
          </Badge>
          {allYears.map((year) => (
            <Badge
              key={year}
              className={`cursor-pointer text-sm px-3 py-1 ${
                selectedYear === year ? "bg-purple-600" : "bg-gray-700"
              }`}
              onClick={() => setSelectedYear(year)}
            >
              Year {year}
            </Badge>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="bg-gray-800 border-gray-700 p-4 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-2/3" />
              </Card>
            ))}
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Book className="mx-auto h-12 w-12 mb-4 opacity-30" />
            <h3 className="text-xl font-medium">No sections found</h3>
            {search && (
              <Button
                className="mt-4 bg-gray-700 hover:bg-gray-600 text-white"
                onClick={() => setSearch("")}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSections.map((section) => (
              <Card
                key={section.sectionId}
                className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{section.sectionName}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-gray-700 text-gray-300">
                          Year {section.year}
                        </Badge>
                        <Badge className="bg-gray-700 text-gray-300">
                          Course ID: {section.courseId}
                        </Badge>
                      </div>
                    </div>
                    <Bookmark className="text-gray-400 hover:text-purple-400" />
                  </div>
                </CardHeader>
                <CardFooter className="pt-1 border-t border-gray-700">
                  <div className="flex justify-between w-full text-sm">
                    <span className="text-gray-400 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Section Schedule
                    </span>
                    <button
                      onClick={() => openScheduleDialog(section)}
                      className="text-purple-400 flex items-center hover:text-purple-300"
                    >
                      <Sparkles className="h-4 w-4 mr-1" /> View Timetable
                    </button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Main Dialog for List View */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-gray-100 sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center">
              <DialogTitle className="text-2xl font-bold text-gray-100">
                {selectedSection?.sectionName}
              </DialogTitle>
              {/* Button to open the table view */}
            </div>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-gray-700 text-gray-300">
                Year {selectedSection?.year}
              </Badge>
              <Badge className="bg-gray-700 text-gray-300">
                Course ID: {selectedSection?.courseId}
              </Badge>
            </div>
          </DialogHeader>

          {isDialogLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Clock className="h-10 w-10 text-gray-600 mb-4 animate-spin" />
              <p className="text-gray-400 font-medium">Loading schedule...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Calendar className="h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400 font-medium">
                No schedule found for this section.
              </p>
            </div>
          ) : (
            <div
              ref={animationParent}
              className="mt-6 max-h-96 overflow-y-auto pr-2"
            >
              {groupedSchedules.map(([day, daySchedules]) => (
                <div key={day} className="mb-6">
                  <h3 className="font-semibold text-gray-300 mb-2 border-b border-gray-800 pb-1">
                    {day}
                  </h3>
                  <div className="space-y-3">
                    {daySchedules.map((schedule, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-all"
                      >
                        <h4 className="text-lg font-medium text-purple-400 flex items-center gap-2">
                          <p>{schedule.subjectName} </p>
                          <Badge variant={"outline"} className="text-xs">
                            {schedule.roomCode}
                          </Badge>
                        </h4>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            {schedule.teacherName}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <DialogFooter className="mt-6 flex justify-between w-full">
            <Button
              onClick={handleViewTableClick}
              className="text-gray-200 bg-blue-700 hover:bg-blue-600"
            >
              <p className="hidden md:block font-medium">View Timetable</p>
              <LayoutGrid className="h-5 w-5" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Table Dialog */}
      <ScheduleDialogTable
        schedules={schedules as any} // Pass the fetched schedules
        open={showTableDialog} // Control visibility with new state
        onOpenChange={setShowTableDialog} // Allow closing the table dialog
      />

      <footer className="border-t border-gray-800 py-6 bg-gray-900">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          &copy; 2025 FacultyHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default SectionsPage;
