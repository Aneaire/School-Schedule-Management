"use client";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type Conflict = {
  teacherName: string;
  subjectName: string;
  roomName: string;
  conflictStartHour: string;
  conflictDuration: string;
};

type Conflicts = {
  room: Conflict[];
  section: Conflict[];
};

interface ScheduleConflictDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conflicts: Conflicts | null;
  onSlotSelect: (hour: number) => void;
  roomId: string;
  day: string;
  duration: number;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Conflict Detected</DialogTitle>
          <DialogDescription>
            The selected time slot conflicts with existing schedules. Please
            choose a different time or day.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {hasRoomConflicts && (
            <div>
              <h3 className="text-sm font-medium mb-2">Room Conflicts:</h3>
              <div className="space-y-2">
                {conflicts.room.map((conflict, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted/50 rounded-md"
                  >
                    <Badge variant="outline" className="px-2 py-1">
                      {conflict.conflictStartHour} - {conflict.conflictDuration}
                    </Badge>
                    <div className="text-sm">
                      <p className="font-medium">{conflict.subjectName}</p>
                      <p className="text-xs text-muted-foreground">
                        Teacher: {conflict.teacherName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasSectionConflicts && (
            <div>
              <h3 className="text-sm font-medium mb-2">Section Conflicts:</h3>
              <div className="space-y-2">
                {conflicts.section.map((conflict, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted/50 rounded-md"
                  >
                    <Badge variant="outline" className="px-2 py-1">
                      {conflict.conflictStartHour} - {conflict.conflictDuration}
                    </Badge>
                    <div className="text-sm">
                      <p className="font-medium">{conflict.subjectName}</p>
                      <p className="text-xs text-muted-foreground">
                        Teacher: {conflict.teacherName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Find the next available slot
                const allConflicts = [...conflicts.room, ...conflicts.section];
                const conflictTimes = allConflicts.map((conflict) => ({
                  start: parseInt(conflict.conflictStartHour.split(":")[0]),
                  end: parseInt(conflict.conflictDuration.split(":")[0]),
                }));

                const durationHours = duration / 60;
                let nextAvailableHour = 7; // Start from 7 AM

                while (nextAvailableHour < 19) {
                  const proposedEndHour = nextAvailableHour + durationHours;
                  const isAvailable = conflictTimes.every(
                    (conflict) =>
                      proposedEndHour <= conflict.start ||
                      nextAvailableHour >= conflict.end
                  );

                  if (isAvailable) {
                    onSlotSelect(nextAvailableHour);
                    onOpenChange(false);
                    return;
                  }

                  nextAvailableHour++;
                }

                // If no available slot found, show error
                alert("No available slots found for the selected duration");
              }}
            >
              Find Next Available Slot
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
