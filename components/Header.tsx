"use client";

import { UserButton } from "@clerk/nextjs";
import { Award } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

const Header = () => {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/95 backdrop-blur">
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-purple-400" />
          <h1 className="text-xl font-bold">FacultyHub</h1>
        </div>
        <nav className="flex gap-5 text-sm font-mono items-center">
          <Link
            href="/"
            className={cn(
              "text-gray-300 hover:text-purple-400 transition-colors",
              pathname === "/" && "text-purple-400"
            )}
          >
            Teachers
          </Link>
          <Link
            href="/sections"
            className={cn(
              "text-gray-300 hover:text-purple-400 transition-colors",
              pathname === "/sections" && "text-purple-400"
            )}
          >
            Sections
          </Link>
          <Link
            href="/rooms"
            className={cn(
              "text-gray-300 hover:text-purple-400 transition-colors",
              pathname === "/rooms" && "text-purple-400"
            )}
          >
            Rooms
          </Link>
          <div>
            <UserButton />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
