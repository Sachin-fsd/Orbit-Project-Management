import type { Subtask } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { useAddSubTaskMutation, useUpdateSubTaskMutation } from "@/hooks/use-task";
import { toast } from "sonner";

export const SubTasksDetails = ({
  subTasks,
  taskId,
}: {
  subTasks: Subtask[];
  taskId: string;
}) => {
  const [newSubTask, setNewSubTask] = useState("");

  const { mutate: updateSubTask, isPending: isUpdating } = useUpdateSubTaskMutation();
  const { mutate: addSubTask, isPending: addPending } = useAddSubTaskMutation();

  const handleToogleTask = async (subTaskId: string, checked: boolean) => {
    updateSubTask(
      { taskId, subTaskId, completed: checked },
      {
        onSuccess: () => {
          toast.success("Sub task updated successfully");
        },
        onError: (error: any) => {
          console.log(error);
          toast.error(error?.response?.data?.message || "Failed to update sub task");
        },
      }
    );
  };

  const handleAddSubTask = async () => {
    if (!newSubTask.trim()) return;
    addSubTask(
      { taskId, title: newSubTask },
      {
        onSuccess: () => {
          setNewSubTask("");
          toast.success("Sub task added successfully");
        },
        onError: (error: any) => {
          console.log(error);
          toast.error(error?.response?.data?.message || "Failed to add sub task");
        },
      }
    );
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-0">SubTasks</h3>
      <div className="space-y-2 mb-4">
        {subTasks.length > 0 ? (
          subTasks.map((subtask) => (
            <div key={subtask._id} className="flex items-center space-x-2">
              <Checkbox
                id={`subtask-${subtask._id}`}
                checked={subtask.completed}
                onCheckedChange={(checked) => handleToogleTask(subtask._id, !!checked)}
                disabled={isUpdating}
              />
              <Label
                className={cn(
                  "text-sm",
                  subtask.completed && "line-through text-muted-foreground"
                )}
              >
                {subtask.title}
              </Label>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">No Sub Tasks</div>
        )}
        <div className="flex">
          <Input
            placeholder="Add a sub task"
            value={newSubTask}
            onChange={(e) => setNewSubTask(e.target.value)}
            className="mr-1"
            disabled={isUpdating || addPending}
          />
          <Button
            disabled={isUpdating || addPending || !newSubTask.trim()}
            onClick={handleAddSubTask}
            className="bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};