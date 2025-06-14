import type { TaskPriority } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useUpdateTaskPriorityMutation } from "@/hooks/use-task";
import { toast } from "sonner";

export const TaskPrioritySelector = ({
  priority,
  taskId,
}: { priority: TaskPriority; taskId: string }) => {
  const { mutate, isPending } = useUpdateTaskPriorityMutation();

  const handlePriorityChange = (value: string) => {
    mutate(
      { taskId, priority: value as TaskPriority },
      {
        onSuccess: () => {
          toast.success("Task priority updated successfully");
        },
        onError: (error: any) => {
          console.log(error);
          toast.error(error?.response?.data?.message || "Failed to update task priority");
        },
      }
    );
  };

  return (
    <Select value={priority || ""} onValueChange={handlePriorityChange}>
      <SelectTrigger className="w-[180px] rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-300 transition" disabled={isPending}>
        <SelectValue placeholder={priority} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Low">Low</SelectItem>
        <SelectItem value="Medium">Medium</SelectItem>
        <SelectItem value="High">High</SelectItem>
      </SelectContent>
    </Select>
  );
};