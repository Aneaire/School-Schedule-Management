// Update for ScheduleConflictDialog to show teacher conflicts & suggest slots with type safety
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { formatTimeTo12Hour } from "~/lib/utils";

interface Conflict {
  teacherName: string;
  subjectName: string;
  roomName: string;
  conflictStartHour: string;
  conflictDuration: string;
}

interface TeacherSchedule {
  subjectName: string;
  roomName: string;
  conflictStartHour: string;
  conflictDuration: string;
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
}

function parseHour(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

function getSuggestedSlots(conflicts: Conflicts, duration: number): number[] {
  const allConflicts: Conflict[] = [
    ...conflicts.room,
    ...conflicts.section,
    ...(conflicts.teacher || []),
  ];

  const teacherTimes = conflicts.allTeacherSchedules || [];

  const conflictTimes = [...allConflicts, ...teacherTimes].map((conflict) => ({
    start: parseHour(conflict.conflictStartHour),
    end: parseHour(conflict.conflictDuration),
  }));

  const suggestions: number[] = [];
  const durationHours = duration / 60;
  for (let hour = 7; hour < 19; hour++) {
    const proposedEnd = hour + durationHours;
    const isFree = conflictTimes.every(
      (conflict) => proposedEnd <= conflict.start || hour >= conflict.end
    );
    if (isFree) suggestions.push(hour);
  }
  return suggestions;
}

export default function ScheduleConflictDialog({
  open,
  onOpenChange,
  conflicts,
  onSlotSelect,
  roomId,
  day,
  duration,
}: ScheduleConflictDialogProps) {
  if (!conflicts) return null;

  const hasRoomConflicts = conflicts.room.length > 0;
  const hasSectionConflicts = conflicts.section.length > 0;
  const hasTeacherConflicts = conflicts.teacher && conflicts.teacher.length > 0;
  const suggested = getSuggestedSlots(conflicts, duration);
  console.log("teacher schedule", conflicts.teacher);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Conflict Detected</DialogTitle>
          <DialogDescription>
            The selected time slot conflicts with existing schedules.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {hasRoomConflicts && (
            <div>
              <h3 className="text-sm font-medium mb-2">Room Conflicts:</h3>
              {conflicts.room.map((conflict, i) => (
                <div key={i} className="p-2 bg-muted/50 rounded-md">
                  <Badge>
                    {formatTimeTo12Hour(conflict.conflictStartHour)} -{" "}
                    {formatTimeTo12Hour(conflict.conflictDuration)}
                  </Badge>
                  <p>
                    {conflict.subjectName} — {conflict.teacherName}
                  </p>
                </div>
              ))}
            </div>
          )}

          {hasSectionConflicts && (
            <div>
              <h3 className="text-sm font-medium mb-2">Section Conflicts:</h3>
              {conflicts.section.map((conflict, i) => (
                <div key={i} className="p-2 bg-muted/50 rounded-md">
                  <Badge>
                    {formatTimeTo12Hour(conflict.conflictStartHour)} -{" "}
                    {formatTimeTo12Hour(conflict.conflictDuration)}
                  </Badge>
                  <p>
                    {conflict.subjectName} — {conflict.teacherName}
                  </p>
                </div>
              ))}
            </div>
          )}

          {conflicts.allTeacherSchedules && (
            <div>
              <h3 className="text-sm font-medium mb-2">
                Teacher's Full Schedule (Today):
              </h3>
              <div className=" p-0.5 border border-gray-300/50 rounded-md">
                {conflicts.allTeacherSchedules.map((sched, i) => (
                  <div key={i} className="p-2 bg-muted/30 rounded-md">
                    <Badge>
                      {formatTimeTo12Hour(sched.conflictStartHour)} -{" "}
                      {formatTimeTo12Hour(sched.conflictDuration)}
                    </Badge>
                    <p>
                      {sched.subjectName} — Room: {sched.roomName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggested.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mt-4 mb-2">
                Suggested Available Slots:
              </h3>
              <div className="flex gap-2 flex-wrap">
                {suggested.map((hour) => (
                  <Button
                    key={hour}
                    variant="outline"
                    onClick={() => {
                      onSlotSelect(hour);
                      onOpenChange(false);
                    }}
                  >
                    {formatTimeTo12Hour(`${hour}:00`)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
