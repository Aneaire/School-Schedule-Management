import { Award } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/95 backdrop-blur">
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-purple-400" />
          <h1 className="text-xl font-bold">FacultyHub</h1>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link
            href="/"
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            Teachers
          </Link>
          <Link
            href="/sections"
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            Sections
          </Link>
          <Link
            href="/rooms"
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            Rooms
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
