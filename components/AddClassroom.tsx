"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const roomSchema = z.object({
  roomCode: z.string().min(1, "Room code is required"),
  roomName: z.string().min(1, "Room name is required"),
});

type FormData = z.infer<typeof roomSchema>;
type Room = { roomId: number; roomCode: string; roomName: string };

export default function AddClassroom() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(roomSchema),
  });

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms");
      if (!res.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      // Check if classroom already exists
      const checkResponse = await fetch(`/api/rooms/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomCode: data.roomCode,
        }),
      });

      const checkResult = await checkResponse.json();

      if (checkResult.exists) {
        toast.error("A classroom with this room code already exists");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to create classroom");
        return;
      }

      toast.success("Classroom created successfully!");
      setSuccessMessage("Classroom has been created successfully!");

      // Reset form
      reset();

      // Refresh the page data
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while creating the classroom");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (room: Room) => {
    try {
      const res = await fetch(`/api/rooms/${room.roomId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete room");
      }

      setRooms(rooms.filter((c) => c.roomId !== room.roomId));
      toast.success("Room deleted successfully!");
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete room"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Add Room</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className=" mb-2" htmlFor="roomCode">
              Room Code
            </Label>
            <Input
              id="roomCode"
              placeholder="e.g., R101"
              className="uppercase"
              {...register("roomCode")}
            />
            {errors.roomCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roomCode.message}
              </p>
            )}
          </div>

          <div>
            <Label className=" mb-2" htmlFor="roomName">
              Room Name
            </Label>
            <Input
              id="roomName"
              placeholder="e.g., Computer Lab 1"
              {...register("roomName")}
            />
            {errors.roomName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roomName.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Room"}
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Rooms List</h3>
          {rooms.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No rooms added yet</p>
          ) : (
            <div className="space-y-3">
              {rooms.map((room) => (
                <div
                  key={room.roomId}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div>
                    <p className="font-medium text-lg">{room.roomCode}</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {room.roomName}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setRoomToDelete(room)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!roomToDelete} onOpenChange={() => setRoomToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this room? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoomToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (roomToDelete) {
                  handleDelete(roomToDelete);
                  setRoomToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
