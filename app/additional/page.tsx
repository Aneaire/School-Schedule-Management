"use client";

import { useState } from "react";
import AddClassroom from "~/components/AddClassroom";
import AddCourse from "~/components/AddCourse";
import AddSection from "~/components/AddSection";
import AddSubject from "~/components/AddSubject";
import AddTeacher from "~/components/AddTeacher";
import { Label } from "~/components/ui/label";
import { Toaster } from "~/components/ui/sonner";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Home() {
  const [showAddCourse, setShowAddCourse] = useState(false);

  return (
    <div className="w-full min-h-screen flex justify-center items-start p-4">
      <Tabs defaultValue="teacher" className="w-full max-w-2xl mt-5">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="teacher">Teacher</TabsTrigger>
          <TabsTrigger value="subject">Subject</TabsTrigger>
          <TabsTrigger value="classroom">Classroom</TabsTrigger>
          <TabsTrigger value="section">Section</TabsTrigger>
        </TabsList>

        <TabsContent value="teacher">
          <AddTeacher />
        </TabsContent>
        <TabsContent value="subject">
          <AddSubject />
        </TabsContent>
        <TabsContent value="classroom">
          <AddClassroom />
        </TabsContent>
        <TabsContent value="section">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="show-add-course"
                checked={showAddCourse}
                onCheckedChange={setShowAddCourse}
              />
              <Label htmlFor="show-add-course">Show Add Course</Label>
            </div>
            <AddSection />
            {showAddCourse && <AddCourse />}
          </div>
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}
