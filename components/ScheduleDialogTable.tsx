// components/ScheduleDialogTable.tsx (or wherever it's located)

import { Clock, User, X } from "lucide-react"; // Import User icon
import { useEffect, useMemo } from "react";

// Define the Schedule interface (should ideally be shared)
interface Schedule {
  scheduleId: number;
  subjectName: string;
  dayName: string;
  startTime: string;
  endTime: string;
  roomCode: string; // Assuming roomName from API is used as roomCode
  teacherName: string; // Add teacherName
  sectionName?: string; // Add sectionName if needed in the table view
}

// Helper function to format time to 12-hour format with AM/PM
const formatTimeTo12Hour = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// Helper function to generate 30-minute time slots from 7:00 AM to 7:00 PM
const generateTimeSlots = () => {
  const slots = [];
  const startMinutes = 7 * 60;
  const endMinutes = 19 * 60;

  for (
    let totalMinutes = startMinutes;
    totalMinutes <= endMinutes;
    totalMinutes += 30
  ) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    slots.push(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`
    );
  }
  return slots;
};

// Helper function to convert "HH:MM" time string to total minutes from midnight
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Helper function to check if a time slot is covered by a schedule entry
const isSlotCoveredBySchedule = (
  slotMinutes: number,
  startTime: string,
  endTime: string
): boolean => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  // Ensure the slot falls within the schedule's start and end times
  return slotMinutes >= startMinutes && slotMinutes < endMinutes;
};

// Helper function to find the closest time slot for a given time
const findClosestTimeSlot = (time: string, timeSlots: string[]): string => {
  const targetMinutes = timeToMinutes(time);
  let closest = timeSlots[0];
  let minDiff = Math.abs(timeToMinutes(closest) - targetMinutes);

  for (const slot of timeSlots) {
    const diff = Math.abs(timeToMinutes(slot) - targetMinutes);
    if (diff < minDiff) {
      minDiff = diff;
      closest = slot;
    }
  }
  return closest;
};

// Generate consistent colors for subjects
const generateSubjectColor = (subjectName: string): string => {
  const colors = [
    "bg-red-200 text-red-800 border-red-300",
    "bg-blue-200 text-blue-800 border-blue-300",
    "bg-green-200 text-green-800 border-green-300",
    "bg-yellow-200 text-yellow-800 border-yellow-300",
    "bg-purple-200 text-purple-800 border-purple-300",
    "bg-pink-200 text-pink-800 border-pink-300",
    "bg-indigo-200 text-indigo-800 border-indigo-300",
    "bg-orange-200 text-orange-800 border-orange-300",
    "bg-teal-200 text-teal-800 border-teal-300",
    "bg-cyan-200 text-cyan-800 border-cyan-300",
    "bg-lime-200 text-lime-800 border-lime-300",
    "bg-emerald-200 text-emerald-800 border-emerald-300",
  ];

  // Simple hash function to consistently assign colors
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
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

// Custom Dialog Components (Assuming these are defined within this file or imported)
const CustomDialog = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-[98vw] h-[95vh] max-w-none">{children}</div>
    </div>
  );
};

const CustomDialogContent = ({ children, className = "" }: any) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full h-full flex flex-col ${className}`}
    >
      {children}
    </div>
  );
};

const CustomDialogHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      {children}
    </div>
  );
};

const CustomDialogTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
      {children}
    </h2>
  );
};

const ScheduleDialogTable = ({
  schedules,
  open: showTableDialog,
  onOpenChange: setShowTableDialog,
}: {
  schedules: Schedule[]; // Use the updated Schedule interface
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Use the actual schedules data passed in
  const allSchedules = schedules;

  return (
    <CustomDialog open={showTableDialog} onOpenChange={setShowTableDialog}>
      <CustomDialogContent className="max-w-none">
        <CustomDialogHeader>
          <CustomDialogTitle>
            <Clock className="h-5 w-5 text-blue-600" />
            Weekly Schedule Overview
          </CustomDialogTitle>
          <button
            onClick={() => setShowTableDialog(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </CustomDialogHeader>

        <div className="flex-1 overflow-hidden p-3">
          <div className="h-full overflow-auto rounded-lg bg-white dark:bg-gray-900">
            <div className="min-w-full border border-gray-300 dark:border-gray-600">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className="w-20 min-w-[80px] bg-gray-800 text-white p-2 text-center font-bold text-xs border-r border-gray-300 dark:border-gray-600">
                      Time
                    </th>
                    {DAYS.map((day, index) => (
                      <th
                        key={day}
                        className={`bg-gray-100 dark:bg-gray-800 p-2 text-center font-bold min-w-[120px] text-xs text-gray-900 dark:text-gray-100 ${
                          index < DAYS.length - 1
                            ? "border-r border-gray-300 dark:border-gray-600"
                            : ""
                        }`}
                      >
                        {day.substring(0, 3).toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((timeSlot, index) => {
                    const slotMinutes = timeToMinutes(timeSlot);

                    return (
                      <tr
                        key={timeSlot}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="p-1 bg-gray-50 dark:bg-gray-800/30 text-xs font-mono text-center font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap border-r border-gray-300 dark:border-gray-600">
                          {formatTimeTo12Hour(timeSlot)}
                        </td>

                        {DAYS.map((day, dayIndex) => {
                          const entriesForSlot = allSchedules.filter(
                            (s) =>
                              s.dayName?.toLowerCase() === day.toLowerCase() &&
                              isSlotCoveredBySchedule(
                                slotMinutes,
                                s.startTime,
                                s.endTime
                              )
                          );

                          return (
                            <td
                              key={`${day}-${timeSlot}`}
                              className={`p-0.5 align-top h-8 relative ${
                                dayIndex < DAYS.length - 1
                                  ? "border-r border-gray-200 dark:border-gray-700"
                                  : ""
                              }`}
                            >
                              {entriesForSlot.map((entry, entryIdx) => {
                                // Check if this is the first slot where this specific class instance appears
                                const isFirstSlotOfClassInstance =
                                  findClosestTimeSlot(
                                    entry.startTime,
                                    timeSlots
                                  ) === timeSlot;

                                if (!isFirstSlotOfClassInstance) {
                                  return null; // Don't render if not the first slot
                                }

                                const durationInMinutes =
                                  timeToMinutes(entry.endTime) -
                                  timeToMinutes(entry.startTime);
                                const heightInSlots = Math.ceil(
                                  durationInMinutes / 30
                                );
                                const heightInPx = heightInSlots * 32; // Reduced from 48px to 32px per slot

                                // Calculate the top offset if the start time is not exactly on a 30-min slot
                                const startMinutes = timeToMinutes(
                                  entry.startTime
                                );
                                const slotStartMinutes =
                                  timeToMinutes(timeSlot);
                                const offsetMinutes =
                                  startMinutes - slotStartMinutes;
                                const topOffsetPx = (offsetMinutes / 30) * 32; // Reduced from 48px to 32px per slot

                                return (
                                  <div
                                    key={entryIdx}
                                    className={`w-[calc(100%-4px)] ${generateSubjectColor(
                                      entry.subjectName
                                    )} rounded shadow-sm flex flex-col justify-center items-center p-1 absolute`}
                                    style={{
                                      height: `${heightInPx}px`,
                                      top: `${topOffsetPx + 2}px`, // Reduced offset
                                      left: "2px", // Reduced margins
                                      right: "2px",
                                      zIndex: 5,
                                    }}
                                  >
                                    <div className="text-xs font-bold leading-tight mb-0.5 text-center">
                                      {entry.subjectName}
                                    </div>
                                    <div className="text-xs font-semibold leading-tight mb-0.5 text-center underline">
                                      {entry.roomCode}
                                    </div>
                                    {/* Display Teacher Name */}
                                    {entry.teacherName && (
                                      <div className="text-xs leading-tight text-center text-gray-800 flex items-center gap-1">
                                        <User className="h-2.5 w-2.5" />
                                        <span className="truncate max-w-[80px]">
                                          {entry.teacherName}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-3 pt-2 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-200 border border-blue-300 rounded"></div>
                <span className="font-medium">Scheduled Classes</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {formatTimeTo12Hour("7:00")} - {formatTimeTo12Hour("19:00")}
                </span>
              </div>
            </div>
            <div className="text-xs">
              <span className="text-gray-500 dark:text-gray-400">Total: </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {allSchedules.length}
              </span>
            </div>
          </div>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
};

export default ScheduleDialogTable;
