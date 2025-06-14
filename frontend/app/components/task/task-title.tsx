import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useUpdateTaskTitleMutation } from "@/hooks/use-task";
import { toast } from "sonner";

const TaskTitle = ({
  title,
  taskId,
}: {
  title: string;
  taskId: string;
}) => {
  const [isEditting, setIsEditting] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const { mutate, isPending } = useUpdateTaskTitleMutation();

  const updateTitle = () => {
    mutate(
      { taskId, title: newTitle },
      {
        onSuccess: () => {
          setIsEditting(false);
          toast.success("Task title updated successfully");
        },
        onError: (error: any) => {
          console.log(error);
          toast.error(error?.response?.data?.message || "Failed to update task title");
        },
      }
    );
  };
  return (
    <div className="flex items-center gap-2">
      {isEditting ? (
        <Input
          className="text-xl font-semibold w-full"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && updateTitle()}
          disabled={isPending}
        />
      ) : (
        <h1 className="text-xl font-semibold w-full max-w-[600px]">{title}</h1>
      )}
      {isEditting ? (
        <Button className="py-0 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all" size={"sm"} onClick={updateTitle} disabled={isPending}>
          Save
        </Button>
      ) : (
        <Edit className="size-4 cursor-pointer text-indigo-400 hover:text-indigo-600 transition" onClick={() => setIsEditting(true)} />
      )}
    </div>
  );
};

export default TaskTitle;