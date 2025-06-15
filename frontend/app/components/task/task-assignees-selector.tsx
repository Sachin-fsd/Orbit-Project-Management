import type { ProjectMemberRole, Task, User } from "@/types";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useUpdateTaskAssigneesMutation } from "@/hooks/use-task";
import { toast } from "sonner";

export const TaskAssigneesSelector = ({
  task,
  assignees,
  projectMembers,
}: {
  task: Task;
  assignees: User[];
  projectMembers: { user: User; role: ProjectMemberRole }[];
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(assignees.map((assignee) => assignee._id));
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { mutate, isPending } = useUpdateTaskAssigneesMutation();

  const handleSelectAll = () => {
    setSelectedIds(projectMembers.map((member) => member.user._id));
  };

  const handleUnSelectAll = () => {
    setSelectedIds([]);
  };

  const handleSelect = (id: string) => {
    let newSelected: string[] = [];
    if (selectedIds.includes(id)) {
      newSelected = selectedIds.filter((sid) => sid !== id);
    } else {
      newSelected = [...selectedIds, id];
    }
    if(newSelected.length == 0){
      toast.error("Please select at least one assignee");
      return;
    }
    setSelectedIds(newSelected);
  };

  const handleSave = () => {
    mutate(
      { taskId: task._id, assignees: selectedIds },
      {
        onSuccess: () => {
          setDropdownOpen(false);
          toast.success("Assignees updated successfully");
        },
        onError: (error: any) => {
          toast.error("Failed to update Assignees");
          console.log(error);
        },
      }
    );
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Assignees</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedIds.length === 0 ? (
          <span className="text-xs text-muted-foreground">No assignees</span>
        ) : (
          projectMembers
            .filter((member) => selectedIds.includes(member.user._id))
            .map((m) => (
              <div key={m.user._id} className="flex items-center bg-indigo-50 rounded px-2 py-1">
                <Avatar className="size-6 mr-1">
                  <AvatarImage src={m.user.profilePicture} alt={m.user.name} />
                  <AvatarFallback>{m.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-indigo-700">{m.user.name}</span>
              </div>
            ))
        )}
      </div>
      <div className="relative">
        <Button
          className="text-sm text-muted-foreground w-full border rounded px-3 py-2 text-left bg-white"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selectedIds.length === 0 ? "Select assignees" : `${selectedIds.length} selected`}
        </Button>
        {dropdownOpen && (
          <div className="absolute z-10 mt-1 w-full origin-top-right border rounded shadow-lg bg-white max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto">
            <div className="py-1 border-b px-2 flex justify-between">
              <Button className="text-xs text-blue-600" onClick={handleSelectAll}>Select All</Button>
              <Button className="text-xs text-red-600" onClick={handleUnSelectAll}>Unselect All</Button>
            </div>
            {projectMembers.map((m) => (
              <Label
                key={m.user._id}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-indigo-50"
              >
                <Checkbox
                  checked={selectedIds.includes(m.user._id)}
                  onCheckedChange={() => handleSelect(m.user._id)}
                  className="mr-2"
                />
                <Avatar className="size-6 mr-2">
                  <AvatarImage src={m.user.profilePicture} alt={m.user.name} />
                  <AvatarFallback>{m.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{m.user.name}</span>
              </Label>
            ))}
            <div className="flex gap-2 p-2">
              <Button
                variant={"outline"}
                size={"sm"}
                className="font-light"
                onClickCapture={() => setDropdownOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                className="font-light"
                onClickCapture={() => handleSave()}
                disabled={isPending}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};