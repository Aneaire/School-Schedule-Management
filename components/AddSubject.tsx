"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const AddSubject = () => {
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [units, setUnits] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        body: JSON.stringify({
          subjectCode,
          subjectName,
          units: parseInt(units),
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to add subject");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      setSubjectCode("");
      setSubjectName("");
      setUnits("");
    } catch (err) {
      console.error("Error submitting subject:", err);
      toast.error("Failed to add subject");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold">Add New Subject</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subjectCode">Subject Code</Label>
          <Input
            id="subjectCode"
            type="text"
            className="uppercase"
            placeholder="e.g., CS101"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subjectName">Subject Name</Label>
          <Input
            id="subjectName"
            type="text"
            className="capitalize"
            placeholder="e.g., Introduction to Computer Science"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="units">Units</Label>
          <Input
            id="units"
            type="number"
            min="1"
            max="6"
            placeholder="e.g., 3"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Adding..." : "Add Subject"}
        </Button>

        {success && (
          <p className="text-green-500 text-sm">Subject added successfully!</p>
        )}
      </form>
    </div>
  );
};

export default AddSubject;
