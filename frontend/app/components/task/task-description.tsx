import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useUpdateTaskDescriptionMutation } from "@/hooks/use-task";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

const TaskDescription = ({
  description,
  taskId,
}: {
  description: string;
  taskId: string;
}) => {
  const [isEditting, setIsEditting] = useState(false);
  const [newDescription, setNewDescription] = useState(description);

  const { mutate, isPending } = useUpdateTaskDescriptionMutation();

  const updateDescription = () => {
    mutate(
      { taskId, description: newDescription },
      {
        onSuccess: () => {
          setIsEditting(false);
          toast.success("Task description updated successfully");
        },
        onError: (error: any) => {
          console.log(error);
          toast.error(error?.response?.data?.message || "Failed to update task description");
        },
      }
    );
  };
  return (
    <div className="flex items-center gap-2">
      {isEditting ? (
        <Textarea
          className="w-full min-w-3xl"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          disabled={isPending}
        />
      ) : (
        <div className="flex-1 text-muted-foreground text-pretty md:text-base text-sm">{description}</div>
      )}
      {isEditting ? (
        <Button className="py-0 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all" size={"sm"} onClick={updateDescription} disabled={isPending}>
          Save
        </Button>
      ) : (
        <Edit className="size-4 cursor-pointer text-indigo-400 hover:text-indigo-600 transition" onClick={() => setIsEditting(true)} />
      )}
    </div>
  );
};

export default TaskDescription;