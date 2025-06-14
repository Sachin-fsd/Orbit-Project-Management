import type { Task } from "@/types";
import { Link, useSearchParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, AlarmClock } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export const UpcomingTasks = ({ data }: { data: Task[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return (
    <Card className="bg-gradient-to-br from-indigo-50 via-white to-blue-100 shadow-xl border-0 animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlarmClock className="text-indigo-500 size-5 animate-pop" />
          <CardTitle className="text-indigo-700 tracking-wide font-bold">
            Upcoming Tasks
          </CardTitle>
        </div>
        <CardDescription className="text-indigo-400">
          Here are the tasks that are due soon
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No upcoming tasks yet
          </p>
        ) : (
          data.map((task) => (
            <Link
              to={`/workspaces/${workspaceId}/projects/${task.project}/tasks/${task._id}`}
              key={task._id}
              className={cn(
                "flex items-start space-x-3 border-b pb-3 last:border-0 group transition-all duration-300 hover:bg-indigo-50 rounded-lg px-2 py-1",
                task.status === "Done" && "opacity-60"
              )}
              style={{
                borderColor: "#e0e7ff",
              }}
            >
              <div
                className={cn(
                  "mt-0.5 rounded-full p-1 shadow transition-all duration-300",
                  task.priority === "High" && "bg-red-100 text-red-700",
                  task.priority === "Medium" && "bg-yellow-100 text-yellow-700",
                  task.priority === "Low" && "bg-gray-100 text-gray-700",
                  task.status !== "Done" && "group-hover:scale-110"
                )}
              >
                {task.status === "Done" ? (
                  <CheckCircle2 className="w-4 h-4 animate-pop" />
                ) : (
                  <Circle className="w-4 h-4 animate-pop" />
                )}
              </div>

              <div className="space-y-1 flex-1">
                <p className={cn(
                  "font-medium text-sm md:text-base transition-colors",
                  task.status === "Done" ? "line-through text-gray-400" : "text-indigo-900 group-hover:text-indigo-700"
                )}>
                  {task.title}
                </p>
                <div className="flex items-center text-xs text-muted-foreground gap-2">
                  <span className={cn(
                    "capitalize font-semibold",
                    task.status === "Done" ? "text-green-500" : "text-indigo-500"
                  )}>
                    {task.status}
                  </span>
                  {task.dueDate && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="text-indigo-400">
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                        {" "}
                        <span className="italic text-xs">
                          ({formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })})
                        </span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
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
    </Card>
  );
};