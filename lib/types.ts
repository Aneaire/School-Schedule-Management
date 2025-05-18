export type Conflict = {
  teacherName: string;
  subjectName: string;
  roomName: string;
  conflictStartHour: string;
  conflictDuration: string;
};

export type Conflicts = {
  room: Conflict[];
  section: Conflict[];
  teacher: Conflict[];
};
