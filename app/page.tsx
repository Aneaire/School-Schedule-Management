"use client";

import TeacherList from "~/components/TeacherList";
import QueryProvider from "~/lib/react-query/QueryProvider";

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <main className="flex-1 container mx-auto px-6 pt-3 pb-1">
        <QueryProvider>
          <TeacherList />
        </QueryProvider>
      </main>

      <footer className="border-t border-gray-800 py-6 bg-gray-900">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          &copy; 2025 FacultyHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
