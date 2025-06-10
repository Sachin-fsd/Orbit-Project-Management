import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import CreateTaskDialog from "@/components/task/create-task-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseProjectQuery } from "@/hooks/use-project";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import type { Project, Task, TaskStatus } from "@/types";
import { is } from "date-fns/locale";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";



const ProjectDetails = () => {
    const { projectId, workspaceId } = useParams<{ projectId: string, workspaceId: string }>();
    const navigate = useNavigate();

    const [isCreateTask, setIsCreateTask] = useState(false);
    const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");

    const { data, isLoading } = UseProjectQuery(projectId!) as {
        data: {
            tasks: Task[];
            project: Project;
        };
        isLoading: boolean;
    }

    if (isLoading) {
        return <Loader />
    }
    const { tasks, project } = data;
    const projectProgress = getProjectProgress(tasks);

    const handleTaskClick = (taskId: string) => {
        navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
    }

    return (
        <div className='space-y-8'>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <BackButton />
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl md:text-2xl font-bold">{project.title}</h1>
                    </div>
                    {
                        project.description &&
                        <p className="text-sm text-gray-500">
                            {project.description}
                        </p>
                    }
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 min-w-32">
                        <div className="text-sm text-muted-foreground">Progress:</div>
                        <div className="flex-1">
                            <Progress value={projectProgress} className="h-2" />
                        </div>
                        <span className="text-sm text-muted-foreground">{projectProgress}%</span>
                    </div>
                    <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
                </div>
            </div>

            <div className='flex items-center justify-between'>
                <Tabs className="w-full" defaultValue="All">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <TabsList>
                            <TabsTrigger value="All" onClick={() => setTaskFilter("All")}>
                                All Tasks
                            </TabsTrigger>
                            <TabsTrigger value="Done" onClick={() => setTaskFilter("Done")}>
                                Done
                            </TabsTrigger>
                            <TabsTrigger value="In Progress" onClick={() => setTaskFilter("In Progress")}>
                                In Progress
                            </TabsTrigger>
                            <TabsTrigger value="To Do" onClick={() => setTaskFilter("To Do")}>
                                To Do
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center text-sm">
                            <span className="mr-2 text-muted-foreground">Status:</span>
                            <div>
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
                        <div className="grid grid-cols-3 gap-4">
                            <TaskColumn
                                title="To Do"
                                tasks={tasks.filter((task) => task.status === "To Do")}
                                onTaskClick={handleTaskClick}
                            />
                            <TaskColumn
                                title="In Progress"
                                tasks={tasks.filter((task) => task.status === "In Progress")}
                                onTaskClick={handleTaskClick}
                            />
                            <TaskColumn
                                title="Done"
                                tasks={tasks.filter((task) => task.status === "Done")}
                                onTaskClick={handleTaskClick}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="To Do" className="m-0">
                        <div className="grid grid-cols-3 gap-4">
                            <TaskColumn
                                title="To Do"
                                tasks={tasks.filter((task) => task.status === "To Do")}
                                onTaskClick={handleTaskClick}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="In Progress" className="m-0">
                        <div className="grid grid-cols-3 gap-4">
                            <TaskColumn
                                title="In Progress"
                                tasks={tasks.filter((task) => task.status === "In Progress")}
                                onTaskClick={handleTaskClick}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="Done" className="m-0">
                        <div className="grid grid-cols-3 gap-4">
                            <TaskColumn
                                title="Done"
                                tasks={tasks.filter((task) => task.status === "Done")}
                                onTaskClick={handleTaskClick}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <CreateTaskDialog
                open={isCreateTask}
                onOpenChange={setIsCreateTask}
                projectId={projectId!}
                projectMembers={project.members as any}

            />
        </div>
    )
}

export default ProjectDetails

interface TaskColumnProps {
    title: string;
    tasks: Task[];
    onTaskClick: (TaskId: string) => void
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
            <div
                className={cn("space-y-4", !isFullWidth ? "h-full" : "col-span-full mb-4")}
            >
                {!isFullWidth && (
                    <div className="flex items-center justify-between">
                        <h1 className="font-medium">{title}</h1>
                        <Badge variant={"outline"}>{tasks.length}</Badge>
                    </div>
                )}

                <div
                    className={cn("space-y-3", isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4")}
                >
                    {tasks.length === 0 ? (
                        <div className="text-center text-sm to-muted-foreground">
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
    )
}

const TaskCard = ({
    task,
    onClick
}: {
    task: Task;
    onClick: () => void
}) => {
    return (
        <Card
            onClick={onClick}
            className="cursor-pointer hover:shadow-md transition-all hover:translate-y-1 duration-300 ease-in-out"
        >
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Badge>{task.priority}</Badge>
                </div>
            </CardHeader>
        </Card>
    )
}