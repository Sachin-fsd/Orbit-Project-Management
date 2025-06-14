import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useCreateWorkspace } from "@/hooks/use-workspace";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { PlusCircle } from "lucide-react";

interface CreateWorkspaceProps {
  isCreatingWorkspace: boolean;
  setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void;
}

export const colorOptions = [
  "#FF5733", // Red-Orange
  "#33B5FF", // Blue
  "#28C76F", // Green
  "#FFC300", // Yellow
  "#9B59B6", // Purple
  "#FF6F91", // Pink
  "#34495E", // Dark Blue-Gray
  "#F39C12", // Orange
];

export type WorkspaceForm = z.infer<typeof workspaceSchema>;

export const CreateWorkspace = ({
  isCreatingWorkspace,
  setIsCreatingWorkspace,
}: CreateWorkspaceProps) => {
  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      color: "#FF5733",
      description: "",
    },
  });

  const { mutate, isPending } = useCreateWorkspace();
  const navigate = useNavigate();

  const onSubmit = (data: WorkspaceForm) => {
    mutate(data, {
      onSuccess: (data: any) => {
        setIsCreatingWorkspace(false);
        toast.success("Workspace created successfully");
        navigate(`/workspaces/${data._id}`);
      },
      onError: (error: any) => {
        console.log(error);
        toast.error(error?.response?.data?.message || "Failed to create workspace");
      },
    });
  };

  return (
    <Dialog open={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace} modal={true}>
      <DialogContent className="max-h-[80vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-indigo-100 shadow-xl border-0 animate-fade-in">
        <DialogHeader>
          <DialogTitle>
            <span className="flex items-center gap-2 font-[Inter] text-2xl text-indigo-800">
              <PlusCircle className="w-6 h-6 text-indigo-500 animate-pop" />
              Create Workspace
            </span>
          </DialogTitle>
          <DialogDescription className="text-indigo-500">
            Create a new workspace to manage your tasks and projects.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-indigo-700">Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Workspace Name"
                        {...field}
                        className="rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-300 transition"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-indigo-700">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Workspace Description"
                        {...field}
                        rows={3}
                        className="rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-300 transition"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-indigo-700">Color</FormLabel>
                    <FormControl>
                      <div className="flex gap-2 flex-wrap">
                        {colorOptions.map((color) => (
                          <div
                            key={color}
                            className={cn(
                              "w-7 h-7 rounded-full cursor-pointer border-2 border-white shadow transition-all duration-200",
                              field.value === color
                                ? "ring-2 ring-indigo-400 scale-110"
                                : "opacity-80 hover:opacity-100"
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => field.onChange(color)}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 shadow transition-all duration-200"
              >
                {isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        <style>
          {`
            .animate-fade-in {
              animation: fadeIn 0.7s;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px);}
              to { opacity: 1; transform: translateY(0);}
            }
            .animate-pop {
              animation: pop 0.7s;
            }
            @keyframes pop {
              0% { transform: scale(0.7);}
              80% { transform: scale(1.15);}
              100% { transform: scale(1);}
            }
          `}
        </style>
      </DialogContent>
    </Dialog>
  );
};