import { Clock, MapPin } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { formatTimeTo12Hour } from "~/utils/time";

type Schedule = {
  scheduleId: number;
  subjectName: string;
  dayName: string;
  startTime: string;
  endTime: string;
  roomId: number;
  roomCode: string;
  teacherName?: string;
  sectionName: string;
  year: number;
};

interface ScheduleCardProps {
  schedule: Schedule;
}

function getDuration(startTime: string, endTime: string) {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  return endHour * 60 + endMin - (startHour * 60 + startMin);
}

export default function ScheduleCard({ schedule }: ScheduleCardProps) {
  return (
    <Card className="border hover:bg-accent/50 transition-colors">
      <CardContent className="px-3 py-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium truncate">
                {schedule.subjectName}
              </span>
              <Badge variant="outline" className="text-xs shrink-0">
                {schedule.dayName}
              </Badge>
              <Badge variant="secondary" className="text-xs shrink-0">
                {schedule.sectionName}
              </Badge>
            </div>
            <div className="flex items-center text-muted-foreground text-xs gap-2">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span className="font-mono">
                  {formatTimeTo12Hour(schedule.startTime)} -{" "}
                  {formatTimeTo12Hour(schedule.endTime)}
                </span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />

                <span className="truncate">{schedule.roomCode}</span>
              </div>
            </div>
            {schedule.teacherName && (
              <div className="text-xs text-muted-foreground mt-1">
                {schedule.teacherName}
              </div>
            )}
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            {getDuration(schedule.startTime, schedule.endTime)} min
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
