import type { TaskStatus } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useUpdateTaskStatusMutation } from "@/hooks/use-task";
import { toast } from "sonner";

export const TaskStatusSelector = ({
  status,
  taskId,
}: { status: TaskStatus; taskId: string }) => {
  const { mutate, isPending } = useUpdateTaskStatusMutation();

  const handleStatusChange = (value: string) => {
    mutate(
      { taskId, status: value as TaskStatus },
      {
        onSuccess: () => {
          toast.success("Task status updated successfully");
        },
        onError: (error: any) => {
          console.log(error);
          toast.error(error?.response?.data?.message || "Failed to update task status");
        },
      }
    );
  };

  return (
    <Select defaultValue={status} value={status || ""} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px] rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-300 transition" disabled={isPending}>
        <SelectValue placeholder={status} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="To Do">To Do</SelectItem>
        <SelectItem value="In Progress">In Progress</SelectItem>
        <SelectItem value="Done">Done</SelectItem>
      </SelectContent>
    </Select>
  );
};