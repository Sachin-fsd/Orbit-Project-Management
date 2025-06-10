import { useCreateTaskMutation } from "@/hooks/use-task";
import { createTaskSchema } from "@/lib/schema";
import type { ProjectMemberRole, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";


interface CreateTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    projectMembers: { user: User; role: ProjectMemberRole }[]
}


export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

const CreateTaskDialog = ({
    open,
    onOpenChange,
    projectId,
    projectMembers
}: CreateTaskDialogProps) => {

    const form = useForm<CreateTaskFormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "To Do",
            priority: "Medium",
            dueDate: "",
            assignees: [],
        },
    })

    const { mutate, isPending } = useCreateTaskMutation();

    const onSubmit = (data: CreateTaskFormData) => {
        mutate({ projectId, taskData: data }, {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
                toast.success("Task Created Successfully")
            },
            onError: (error: any) => {
                console.log(error);
                toast.error(error?.response?.data?.message || "Failed to create task");
            },
        });
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                    <DialogDescription>
                        Create a new task for this project
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Task Title" {...field} />
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
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Task Description" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormItem>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Status" />
                                                                </SelectTrigger>
                                                            </FormControl>

                                                            <SelectContent>
                                                                <SelectItem value="To Do">To Do</SelectItem>
                                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                                <SelectItem value="Done">Done</SelectItem>
                                                            </SelectContent>
                                                        </FormItem>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Priority</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormItem>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select Priority" />
                                                                </SelectTrigger>
                                                            </FormControl>

                                                            <SelectContent>
                                                                <SelectItem value="Low">Low</SelectItem>
                                                                <SelectItem value="Medium">Medium</SelectItem>
                                                                <SelectItem value="Done">Done</SelectItem>
                                                            </SelectContent>
                                                        </FormItem>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Due Date</FormLabel>
                                            <FormControl>
                                                <Popover modal={true}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={"w-full justify-start text-left font-normal" + (!field.value ? "text-muted-foreground" : "")}
                                                        >
                                                            <CalendarIcon className="mr-2 size-4" />
                                                            {
                                                                field.value ? (
                                                                    <span>{format(new Date(field.value), "PPPP")}</span>
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )
                                                            }

                                                        </Button>
                                                    </PopoverTrigger>

                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined}
                                                            onSelect={(date) => {
                                                                field.onChange(date?.toISOString() || undefined)
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="assignees"
                                    render={({ field }) => {

                                        const selectedMembers = field.value || []

                                        return <FormItem className="w-full">
                                            <FormLabel>Assignees</FormLabel>
                                            <FormControl>
                                                <Popover modal={true}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={"w-full justify-start text-left font-normal min-h-11"}
                                                        >
                                                            {
                                                                selectedMembers.length === 0 ? (
                                                                    <span className="text-muted-foreground">Pick assignees</span>
                                                                ) : selectedMembers.length <= 2 ? (
                                                                    selectedMembers.map((m) => {
                                                                        const member = projectMembers.find((member) => member.user._id === m)
                                                                        return `${member?.user.name}`
                                                                    }).join(", ")
                                                                ) : (
                                                                    <span className="text-muted-foreground">{selectedMembers.length} assignees</span>
                                                                )
                                                            }

                                                        </Button>
                                                    </PopoverTrigger>

                                                    <PopoverContent className="w-sm max-h-60 overflow-y-auto p-2" align="start">
                                                        <div className="flex flex-col gap-2">
                                                            {
                                                                projectMembers.map((member) => {
                                                                    const selectedMember = selectedMembers.find((m) => m === member.user?._id);

                                                                    return (
                                                                        <div
                                                                            key={member.user._id}
                                                                            className="flex items-center gap-2 p-2 border rounded"
                                                                        >
                                                                            <Checkbox
                                                                                checked={!!selectedMember}
                                                                                onCheckedChange={(checked) => {
                                                                                    if (checked) {
                                                                                        field.onChange([...selectedMembers, member.user._id]);
                                                                                    } else {
                                                                                        field.onChange(selectedMembers.filter((m) => m !== member.user._id));
                                                                                    }
                                                                                }}
                                                                                id={`member-${member.user._id}`}
                                                                            />
                                                                            <span className="truncate flex-1">{member.user.name}</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    }}
                                />

                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Creating Task..." : "Create Task"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTaskDialog