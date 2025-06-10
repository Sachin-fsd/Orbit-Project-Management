import { projectSchema } from "@/lib/schema"
import { ProjectStatus, type MemberProps } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { UseCreateProject } from "@/hooks/use-project"
import { toast } from "sonner"


interface CreateProjectDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    workspaceId: string
    workspaceMembers: MemberProps[]
}

export type CreateProjectFormdata = z.infer<typeof projectSchema>

const CreateProjectDialog = ({
    isOpen,
    onOpenChange,
    workspaceId,
    workspaceMembers
}: CreateProjectDialogProps) => {
    const form = useForm<CreateProjectFormdata>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            description: '',
            status: ProjectStatus.PLANNING,
            startDate: "",
            dueDate: "",
            members: [],
            tags: undefined
        }
    })

    const { mutate, isPending } = UseCreateProject();

    const onSubmit = (values: CreateProjectFormdata) => {
        if (!workspaceId) return;
        mutate({ workspaceId, projectData: values }, {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
                toast.success("Project Created Successfully")
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Failed to create project")
            },
        });
    }
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px]">
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription> Create a new project</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Project title" {...field} />
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
                                        <Input placeholder="Project description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {Object.values(ProjectStatus).map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Popover modal={true}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className="w-full justify-start text-left font-normal"
                                                    >
                                                        <CalendarIcon className="size-4 mr-2" />
                                                        {
                                                            field.value ? format(new Date(field.value), "PPPP") : <span>Select date</span>

                                                        }
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent>
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => {
                                                            field.onChange(date?.toISOString() || "");
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
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Due Date</FormLabel>
                                        <FormControl>
                                            <Popover modal={true}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className="w-full justify-start text-left font-normal"
                                                    >
                                                        <CalendarIcon className="size-4 mr-2" />
                                                        {
                                                            field.value ? format(new Date(field.value), "PPPP") : <span>Select date</span>

                                                        }
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent>
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => {
                                                            field.onChange(date?.toISOString() || "");
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tags separated by Comma" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="members"
                            render={({ field }) => {
                                const selectedMembers = field.value || [];
                                return (
                                    <FormItem>
                                        <FormLabel>Members</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline"
                                                        className="w-full justify-start text-left font-normal min-h-11"
                                                    >
                                                        {
                                                            selectedMembers.length === 0 ? (
                                                                <span className="text-muted-foreground">Select Members</span>
                                                            ) :
                                                                selectedMembers.length <= 2 ? (
                                                                    selectedMembers.map(m => {
                                                                        const member = workspaceMembers.find((wm) => wm.user._id === m.user);
                                                                        return `${member?.user.name} (${m.role})`
                                                                    }).join(", ")
                                                                ) : (
                                                                    `${selectedMembers.length} members selected`
                                                                )
                                                        }
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-sm max-w-60 overflow-y-auto" align="start">
                                                    <div className="flex flex-col gap-2">
                                                        {
                                                            workspaceMembers.map((member) => {
                                                                const selectedMember = selectedMembers.find((wm) => wm.user === member.user._id);

                                                                return <div key={member._id} className="flex items-center gap-2 p-2 border rounded">
                                                                    <Checkbox
                                                                        checked={!!selectedMember}
                                                                        onCheckedChange={(checked) => {
                                                                            if (checked) {
                                                                                // Only add if not already present
                                                                                if (!selectedMember) {
                                                                                    field.onChange([...selectedMembers, { user: member.user._id, role: "contributor" }]);
                                                                                }
                                                                            } else {
                                                                                field.onChange(selectedMembers.filter((m) => m.user !== member.user._id));
                                                                            }
                                                                        }}
                                                                        id={`member-${member.user._id}`}
                                                                    />
                                                                    <span className="truncate flex-1">
                                                                        {member.user.name}
                                                                    </span>
                                                                    {
                                                                        selectedMember && (
                                                                            <Select
                                                                                value={selectedMember.role}
                                                                                onValueChange={(role) => {
                                                                                    // Update the role for this member
                                                                                    field.onChange(selectedMembers.map((m) =>
                                                                                        m.user === member.user._id
                                                                                            ? { ...m, role : role as | "manager" | "contributor" | "viewer" }
                                                                                            : m
                                                                                    ));
                                                                                }}
                                                                            >
                                                                                <SelectTrigger className="w-24">
                                                                                    <SelectValue placeholder="Select a role" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="manager">Manager</SelectItem>
                                                                                    <SelectItem value="contributor">Contributor</SelectItem>
                                                                                    <SelectItem value="viewer">Viewer</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        )}
                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                        <DialogFooter>
                            <Button disabled={isPending} type="submit">{isPending ? "Creating Project..." : "Create Project"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}

export default CreateProjectDialog