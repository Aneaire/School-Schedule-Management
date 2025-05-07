import {
  Award,
  Book,
  Bookmark,
  Mail,
  Search,
  Sparkles,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";

type Teacher = {
  id: number;
  name: string;
  email: string;
  subjects: { id: number; name: string }[];
};

const TeacherDashboard = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Fetch the list of teachers from the backend or API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/teachers");
        const data = await res.json();
        setTeachers(data);
      } catch (err) {
        console.error("Failed to fetch teachers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // Get all unique subjects
  const allSubjects = [
    ...new Set(
      teachers.flatMap((teacher) =>
        teacher.subjects.map((subject) => subject.name)
      )
    ),
  ].sort();

  // Filter teachers based on search term and selected subject
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = selectedSubject
      ? teacher.subjects.some((subject) => subject.name === selectedSubject)
      : true;

    return matchesSearch && matchesSubject;
  });

  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get a color based on the first letter of name (for avatar background)
  const getColorClass = (name: string) => {
    const colors = [
      "bg-purple-600",
      "bg-blue-600",
      "bg-green-600",
      "bg-amber-600",
      "bg-red-600",
      "bg-pink-600",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-purple-400" />
              <h1 className="text-xl font-bold">FacultyHub</h1>
            </div>
            <div className="relative w-full max-w-md mx-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search teachers..."
                className="w-full bg-gray-800 border-gray-700 pl-10 focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <UserCircle className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Subject filter buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge
            className={`cursor-pointer text-sm px-3 py-1 ${
              !selectedSubject
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setSelectedSubject(null)}
          >
            All Subjects
          </Badge>
          {allSubjects.map((subject) => (
            <Badge
              key={subject}
              className={`cursor-pointer text-sm px-3 py-1 ${
                selectedSubject === subject
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setSelectedSubject(subject)}
            >
              {subject}
            </Badge>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Book className="mx-auto h-12 w-12 mb-4 opacity-30" />
            <h3 className="text-xl font-medium">No teachers found</h3>
            <p className="mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <Card
                key={teacher.id}
                className="bg-gray-800 border-gray-700 overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <Avatar
                        className={`h-12 w-12 ${getColorClass(teacher.name)}`}
                      >
                        <AvatarFallback>
                          {getInitials(teacher.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg text-white">
                          {teacher.name}
                        </CardTitle>
                        <CardDescription className="flex items-center text-gray-400">
                          <Mail className="h-3 w-3 mr-1" />
                          {teacher.email}
                        </CardDescription>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-purple-400 transition-colors">
                      <Bookmark className="h-5 w-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map((subject) => (
                      <Badge
                        key={subject.id}
                        className="bg-gray-700 hover:bg-gray-600 text-xs"
                      >
                        {subject.name}
                      </Badge>
                    ))}
                    {teacher.subjects.length === 0 && (
                      <span className="text-sm text-gray-400">
                        No subjects assigned
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-1 border-t border-gray-700">
                  <div className="flex items-center justify-between w-full text-sm">
                    <span className="flex items-center text-gray-400">
                      <Book className="h-4 w-4 mr-1" />
                      {teacher.subjects.length}{" "}
                      {teacher.subjects.length === 1 ? "subject" : "subjects"}
                    </span>
                    <button className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                      <Sparkles className="h-4 w-4 mr-1" />
                      View Profile
                    </button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 py-6 bg-gray-900">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          <p>&copy; 2025 FacultyHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TeacherDashboard;
