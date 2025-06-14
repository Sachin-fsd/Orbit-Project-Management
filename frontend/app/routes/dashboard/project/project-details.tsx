import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import CreateTaskDialog from "@/components/task/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeleteProjectMutation, UseProjectQuery } from "@/hooks/use-project";
import { useUpdateTaskStatusMutation } from "@/hooks/use-task";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import type { Project, Task, TaskStatus } from "@/types";
import { format } from "date-fns";
import { AlertCircle, Calendar, CheckCircle, Clock, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { useTheme } from "@/provider/theme-context";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ProjectDetails = () => {
    const { theme } = useTheme();
    const { mutate: updateTaskStatus } = useUpdateTaskStatusMutation();
    const { projectId, workspaceId } = useParams<{ projectId: string, workspaceId: string }>();
    const navigate = useNavigate();

    const [isCreateTask, setIsCreateTask] = useState(false);
    const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");
    const [tasksState, setTasksState] = useState<Task[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { mutate: deleteProject, isPending: isDeleting } = useDeleteProjectMutation();

    const handleDeleteProject = () => {
        if (!projectId || !workspaceId) return;
        deleteProject(
            { projectId, workspaceId },
            {
                onSuccess: () => {
                    toast.success("Project deleted!");
                    setShowDeleteDialog(false);
                    navigate(`/workspaces/${workspaceId}`);
                },
                onError: () => toast.error("Failed to delete project"),
            }
        );
    };

    const { data, isLoading, error } = UseProjectQuery(projectId!) as {
        data: {
            tasks: Task[];
            project: Project;
        };
        isLoading: boolean;
        error?: any;
    };

    useEffect(() => {
        if (data?.tasks) setTasksState(data.tasks);
    }, [data?.tasks]);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">Error loading project. Please try again later.</div>;
    }

    if (!data) {
        return <div className="text-center mt-10 text-muted-foreground">Project not found</div>;
    }

    const { tasks, project } = data;
    const projectProgress = getProjectProgress(tasks);

    const columns = [
        { id: "To Do", title: "To Do" },
        { id: "In Progress", title: "In Progress" },
        { id: "Done", title: "Done" },
    ];

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }
        const task = tasksState.find((t) => t._id === draggableId);
        if (!task) return;
        const updatedTask = { ...task, status: destination.droppableId };
        const newTasks = tasksState.map((t) =>
            t._id === draggableId ? updatedTask : t
        );
        setTasksState(newTasks);

        updateTaskStatus(
            { taskId: draggableId, status: destination.droppableId as any },
            {
                onSuccess: () => {
                    toast.success("Task status updated successfully");
                },
                onError: (error) => {
                    toast.error("Error updating task status");
                    setTasksState(tasks); // revert on error
                },
            }
        );
    };

    const handleTaskClick = (taskId: string) => {
        if (!workspaceId || !projectId) return;
        navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
    };

    // Defensive: fallback for missing project fields
    const projectTitle = project?.title || "Untitled Project";
    const projectDescription = project?.description || "";

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <BackButton />
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-semibold font-[Inter] text-indigo-900 tracking-tight drop-shadow-sm flex items-center gap-2">
                            {projectTitle}
                        </h1>
                    </div>
                    {projectDescription && (
                        <p className="text-sm text-indigo-500 mt-1">{projectDescription}</p>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 min-w-32">
                        <div className="text-sm text-muted-foreground">Progress:</div>
                        <div className="flex-1">
                            <Progress value={projectProgress} className="h-2 bg-indigo-100" />
                        </div>
                        <span className="text-sm text-indigo-700 font-semibold">{projectProgress}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="destructive"
                            className="flex items-center gap-2"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Project
                        </Button>
                        <Button
                            onClick={() => setIsCreateTask(true)}
                            className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Add Task
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <Tabs className="w-full" defaultValue="All">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <TabsList>
                            <TabsTrigger value="All" onClick={() => setTaskFilter("All")}>
                                All Tasks
                            </TabsTrigger>
                            <TabsTrigger value="To Do" onClick={() => setTaskFilter("To Do")}>
                                To Do
                            </TabsTrigger>
                            <TabsTrigger value="In Progress" onClick={() => setTaskFilter("In Progress")}>
                                In Progress
                            </TabsTrigger>
                            <TabsTrigger value="Done" onClick={() => setTaskFilter("Done")}>
                                Done
                            </TabsTrigger>
                        </TabsList>
                        <div className="flex items-center text-sm">
                            <span className="mr-2 text-muted-foreground">Status:</span>
                            <div className="flex gap-2">
                                <Badge>
                                    {tasks.filter((task) => task.status === "To Do").length} To Do
                                </Badge>
                                <Badge>
                                    {tasks.filter((task) => task.status === "In Progress").length} In Progress
                                </Badge>
                                <Badge>
                                    {tasks.filter((task) => task.status === "Done").length} Done
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <TabsContent value="All" className="m-0">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {columns.map((col) => (
                                    <Droppable droppableId={col.id} key={col.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={cn(
                                                    "space-y-4 bg-indigo-50/60 rounded-xl p-2 min-h-[200px] transition-all duration-300",
                                                    snapshot.isDraggingOver && "ring-2 ring-indigo-300"
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h2 className="font-semibold text-indigo-700">{col.title}</h2>
                                                    <Badge variant={"outline"}>
                                                        {tasksState.filter((task) => task.status === col.id).length}
                                                    </Badge>
                                                </div>
                                                {tasksState
                                                    .filter((task) => task.status === col.id)
                                                    .map((task, idx) => (
                                                        <Draggable draggableId={task._id} index={idx} key={task._id}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={cn(
                                                                        "mb-2",
                                                                        snapshot.isDragging ? "ring-2 ring-indigo-400 bg-white" : ""
                                                                    )}
                                                                >
                                                                    <TaskCard
                                                                        task={task}
                                                                        onClick={() => handleTaskClick(task._id)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                ))}
                            </div>
                        </DragDropContext>
                    </TabsContent>

                    {/* Filtered Tabs */}
                    {["To Do", "In Progress", "Done"].map((status) => (
                        <TabsContent value={status} className="m-0" key={status}>
                            <TaskColumn
                                title={status}
                                tasks={tasks.filter((task) => task.status === status)}
                                onTaskClick={handleTaskClick}
                                isFullWidth
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            <CreateTaskDialog
                open={isCreateTask}
                onOpenChange={setIsCreateTask}
                projectId={projectId!}
                projectMembers={project.members as any}
            />
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Project</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-red-600 font-semibold mb-2">
                            Are you sure you want to delete this project? This action cannot be undone.
                        </p>
                        <p className="text-muted-foreground">All tasks in this project will be permanently deleted.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteProject} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <style>
                {`
                .animate-fade-in {
                    animation: fadeIn 0.7s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                `}
            </style>
        </div>
    );
};

export default ProjectDetails;

interface TaskColumnProps {
    title: string;
    tasks: Task[];
    onTaskClick: (TaskId: string) => void;
    isFullWidth?: boolean;
}

const TaskColumn = ({
    title,
    tasks,
    onTaskClick,
    isFullWidth = false
}: TaskColumnProps) => {
    return (
        <div className={isFullWidth ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : ""}>
            <div className={cn("space-y-4", !isFullWidth ? "h-full" : "col-span-full mb-4")}>
                {!isFullWidth && (
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-indigo-700">{title}</h2>
                        <Badge variant={"outline"}>{tasks.length}</Badge>
                    </div>
                )}
                <div className={cn("space-y-3", isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4")}>
                    {tasks.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground">
                            No Tasks Yet
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onClick={() => onTaskClick(task._id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const TaskCard = ({
    task,
    onClick
}: {
    task: Task;
    onClick: () => void;
}) => {
    return (
        <Card
            onClick={onClick}
            className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 duration-300 ease-in-out bg-white/90 border-0 rounded-xl group overflow-hidden"
        >
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Badge
                        className={
                            task.priority === "High"
                                ? "bg-red-500 text-white"
                                : task.priority === "Medium"
                                    ? "bg-orange-500 text-white"
                                    : "bg-green-500 text-white"
                        }
                    >
                        {task.priority}
                    </Badge>
                    <div className="flex gap-1">
                        {/* Status change buttons could be implemented here if needed */}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <CardTitle className="font-medium mb-2 text-indigo-900">{task.title}</CardTitle>
                {task.description && (
                    <CardDescription className="line-clamp-2 mb-2 text-muted-foreground text-sm">
                        {task.description}
                    </CardDescription>
                )}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        {task.assignees && task.assignees.length > 0 && (
                            <div className="flex -space-x-2">
                                {task.assignees.slice(0, 5).map((member) => (
                                    <Avatar
                                        key={member._id}
                                        className="relative size-8 bg-gray-700 rounded-full border-2 border-background overflow-hidden"
                                        title={member.name}
                                    >
                                        <AvatarImage src={member.profilePicture} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                ))}
                                {task.assignees.length > 5 && (
                                    <span className="text-xs text-muted-foreground">
                                        + {task.assignees.length - 5}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    {task.dueDate && (
                        <div className="flex items-center text-xs text-indigo-400">
                            <Calendar className="size-3 mr-1" />
                            {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </div>
                    )}
                </div>
                {task.subTasks && task.subTasks.length > 0 && (
                    <div className="mt-2 text-xs text-indigo-500">
                        {task.subTasks.filter((subtask) => subtask.completed).length} /{" "}
                        {task.subTasks.length} subtasks
                    </div>
                )}
            </CardContent>
        </Card>
    );
};