// Enhanced ScheduleConflictDialog with alternative day and duration recommendations
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  formatTimeTo12Hour,
  formatTimeTo12Hour2,
  parseHour,
} from "~/utils/time";

interface Conflict {
  teacherName: string;
  subjectName: string;
  roomName: string;
  conflictStartHour: string;
  conflictEndHour: string;
}

interface TeacherSchedule {
  subjectName: string;
  roomName: string;
  conflictStartHour: string;
  conflictEndHour: string;
}

interface Conflicts {
  room: Conflict[];
  section: Conflict[];
  teacher?: Conflict[];
  allTeacherSchedules?: TeacherSchedule[];
}

interface ScheduleConflictDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conflicts: Conflicts | null;
  onSlotSelect: (hour: number) => void;
  roomId: string;
  day: string;
  duration: number;
  onDayChange?: (day: string) => void;
  onDurationChange?: (duration: number) => void;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DURATION_OPTIONS = [60, 90, 120, 150, 180, 210, 240, 270, 300];

function getSuggestedSlots(conflicts: Conflicts, duration: number): number[] {
  const allConflicts: Conflict[] = [
    ...conflicts.room,
    ...conflicts.section,
    ...(conflicts.teacher || []),
  ];
  const teacherTimes = conflicts.allTeacherSchedules || [];

  const conflictTimes = [...allConflicts, ...teacherTimes].map((conflict) => ({
    start: parseHour(conflict.conflictStartHour),
    end: parseHour(conflict.conflictEndHour),
  }));

  const suggestions: number[] = [];
  const durationHours = duration / 60;

  for (let hour = 7; hour <= 19 - durationHours; hour += 0.5) {
    const proposedEnd = hour + durationHours;
    const overlaps = conflictTimes.some(
      (c) => !(proposedEnd <= c.start || hour >= c.end)
    );

    if (!overlaps) {
      suggestions.push(hour);
    }
  }

  return suggestions;
}

function getAvailableDurations(conflicts: Conflicts): number[] {
  const allConflicts: Conflict[] = [
    ...conflicts.room,
    ...conflicts.section,
    ...(conflicts.teacher || []),
  ];
  const teacherTimes = conflicts.allTeacherSchedules || [];

  const conflictTimes = [...allConflicts, ...teacherTimes].map((conflict) => ({
    start: parseHour(conflict.conflictStartHour),
    end: parseHour(conflict.conflictEndHour),
  }));

  const availableDurations: number[] = [];

  // Check each duration option
  for (const duration of DURATION_OPTIONS) {
    const durationHours = duration / 60;
    let foundSlot = false;

    // Check if this duration can fit in any time slot
    for (let hour = 7; hour <= 19 - durationHours && !foundSlot; hour += 0.5) {
      const proposedEnd = hour + durationHours;
      const overlaps = conflictTimes.some(
        (c) => !(proposedEnd <= c.start || hour >= c.end)
      );

      if (!overlaps) {
        foundSlot = true;
        availableDurations.push(duration);
      }
    }
  }

  return availableDurations;
}

export default function ScheduleConflictDialog({
  open,
  onOpenChange,
  conflicts,
  onSlotSelect,
  roomId,
  day,
  duration,
  onDayChange,
  onDurationChange,
}: ScheduleConflictDialogProps) {
  if (!conflicts) return null;

  const hasRoomConflicts = conflicts.room.length > 0;
  const hasSectionConflicts = conflicts.section.length > 0;
  const hasTeacherConflicts = conflicts.teacher && conflicts.teacher.length > 0;
  const suggested = getSuggestedSlots(conflicts, duration);
  const availableDurations = getAvailableDurations(conflicts);

  // Get other days as suggestions (excluding current day)
  const otherDays = DAYS.filter((d) => d !== day);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] flex flex-col max-w-2xl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Schedule Conflict Detected</DialogTitle>
          <DialogDescription>
            The selected time slot conflicts with existing schedules.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 pr-2">
          {hasRoomConflicts && (
            <div>
              <h3 className="text-sm font-medium mb-2 sticky top-0 bg-background">
                Room Conflicts:
              </h3>
              <div className="border border-gray-300/50 rounded-md">
                <div className="max-h-32 overflow-y-auto space-y-2 p-2">
                  {conflicts.room.map((conflict, i) => (
                    <div key={i} className="p-2 bg-muted/50 rounded-md">
                      <Badge className="mb-1">
                        {formatTimeTo12Hour(conflict.conflictStartHour)} -{" "}
                        {formatTimeTo12Hour(conflict.conflictEndHour)}
                      </Badge>
                      <p className="text-sm">
                        {conflict.subjectName} — {conflict.teacherName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hasSectionConflicts && (
            <div>
              <h3 className="text-sm font-medium mb-2 sticky top-0 bg-background">
                Section Conflicts:
              </h3>
              <div className="border border-gray-300/50 rounded-md">
                <div className="max-h-32 overflow-y-auto space-y-2 p-2">
                  {conflicts.section.map((conflict, i) => (
                    <div key={i} className="p-2 bg-muted/50 rounded-md">
                      <Badge className="mb-1">
                        {formatTimeTo12Hour(conflict.conflictStartHour)} -{" "}
                        {formatTimeTo12Hour(conflict.conflictEndHour)}
                      </Badge>
                      <p className="text-sm">
                        {conflict.subjectName} — {conflict.teacherName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hasTeacherConflicts && conflicts.allTeacherSchedules && (
            <div>
              <h3 className="text-sm font-medium mb-2 sticky top-0 bg-background">
                Teacher's Full Schedule ({day}):
              </h3>
              <div className="border border-gray-300/50 rounded-md">
                <div className="max-h-40 overflow-y-auto p-2 space-y-1">
                  {conflicts.allTeacherSchedules.map((sched, i) => (
                    <div key={i} className="p-2 bg-muted/30 rounded-md">
                      <Badge className="mb-1">
                        {formatTimeTo12Hour(sched.conflictStartHour)} -{" "}
                        {formatTimeTo12Hour(sched.conflictEndHour)}
                      </Badge>
                      <p className="text-sm">
                        {sched.subjectName} — Room: {sched.roomName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Available time slots for current day and duration */}
          {suggested.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium mt-4 mb-2 sticky top-0 bg-background">
                Available Slots ({day}, {duration} minutes):
              </h3>
              <div className="max-h-24 overflow-y-auto">
                <div className="flex gap-2 flex-wrap">
                  {suggested.map((hour) => (
                    <Button
                      key={hour}
                      variant="outline"
                      onClick={() => {
                        onSlotSelect(hour);
                        onOpenChange(false);
                      }}
                      className="text-green-700 border-green-300 hover:bg-green-50"
                    >
                      {formatTimeTo12Hour2(hour)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* No available slots - show alternatives */
            <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-orange-800 mb-3">
                ⚠️ No Available Slots for {day} ({duration} minutes)
              </h3>

              <div className="space-y-4">
                {/* Alternative durations for the same day */}
                {availableDurations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-orange-700 mb-2">
                      Try Different Duration ({day}):
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {availableDurations.map((dur) => (
                        <Button
                          key={dur}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onDurationChange?.(dur);
                            onOpenChange(false);
                          }}
                          className="text-blue-700 border-blue-300 hover:bg-blue-50"
                        >
                          {dur} min
                          {dur >= 60 && (
                            <span className="text-xs ml-1">
                              ({Math.floor(dur / 60)}h{dur % 60 ? "30m" : ""})
                            </span>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alternative days */}
                <div>
                  <h4 className="text-sm font-medium text-orange-700 mb-2">
                    Try Different Day ({duration} minutes):
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {otherDays.map((altDay) => (
                      <Button
                        key={altDay}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onDayChange?.(altDay);
                          onOpenChange(false);
                        }}
                        className="text-purple-700 border-purple-300 hover:bg-purple-50"
                      >
                        {altDay}
                      </Button>
                    ))}
                  </div>
                </div>

                {availableDurations.length === 0 && (
                  <div className="text-sm text-orange-700 bg-orange-100 p-3 rounded">
                    <p className="font-medium mb-1">
                      No time slots available on {day}
                    </p>
                    <p>
                      Consider choosing a different day or check if there are
                      scheduling conflicts that can be resolved.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
