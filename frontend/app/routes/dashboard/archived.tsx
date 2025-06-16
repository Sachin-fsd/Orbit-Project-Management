import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetArchivedTasksQuery } from "@/hooks/use-task";
import { format } from "date-fns";
import { Archive, ArrowUpRight } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

const ArchivedPage = () => {
    const [searchParams] = useSearchParams();
    const workspaceId = searchParams.get("workspaceId") || "";
    const { data, isLoading, error } = useGetArchivedTasksQuery(workspaceId);
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-96 text-red-500">
                Failed to load archived tasks.
            </div>
        );
    }

    const archivedTasks = data || [];

    return (
        <div className="container mx-auto py-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <Archive className="text-indigo-500 size-8 animate-pop" />
                <h1 className="text-3xl font-bold text-indigo-900 tracking-tight">Archived Tasks</h1>
            </div>
            <AnimatePresence>
                {archivedTasks.length === 0 ? (
                    <motion.div
                        className="text-center text-muted-foreground text-lg mt-24"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                    >
                        No archived tasks found.
                    </motion.div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {archivedTasks.map((task) => (
                            <motion.div
                                key={task._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 30 }}
                                transition={{ duration: 0.4, type: "spring" }}
                            >
                                <Card className="bg-white/90 border-0 shadow-xl rounded-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-indigo-800 group-hover:text-indigo-900 transition-colors">
                                            {task.title}
                                        </CardTitle>
                                        <Badge variant="outline" className="text-xs">
                                            {task.priority}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-muted-foreground mb-2 line-clamp-2">
                                            {task.description || "No description"}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-indigo-500">
                                            <span>
                                                {task.dueDate && (
                                                    <>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</>
                                                )}
                                            </span>
                                            <Link
                                                to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                                                className="flex items-center gap-1 hover:underline"
                                            >
                                                View <ArrowUpRight className="size-4" />
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
            <style>
                {`
          .animate-fade-in {
            animation: fadeIn 0.8s;
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
        </div>
    );
};

export default ArchivedPage;