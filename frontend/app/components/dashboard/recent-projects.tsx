import type { Project } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getProjectProgress, getTaskStatusColor } from "@/lib";
import { Link, useSearchParams } from "react-router";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { FolderKanban, ArrowRight } from "lucide-react";

export const RecentProjects = ({ data }: { data: Project[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return (
    <Card className="lg:col-span-2 bg-gradient-to-br from-blue-50 via-white to-indigo-100 shadow-xl border-0 animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FolderKanban className="text-indigo-500 size-6 animate-pop" />
          <CardTitle className="text-indigo-700 tracking-wide font-bold">
            Recent Projects
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No Recent project yet
          </p>
        ) : (
          data.map((project) => {
            const projectProgress = getProjectProgress(project.tasks);

            return (
              <div
                key={project._id}
                className="border rounded-xl p-4 bg-white/80 shadow-md hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                style={{
                  borderColor: "#e0e7ff",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Link
                    to={`/workspaces/${workspaceId}/projects/${project._id}`}
                    className="flex items-center gap-2 group-hover:underline"
                  >
                    <h3 className="font-semibold text-blue-700 group-hover:text-indigo-600 transition-colors text-lg">
                      {project.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <span
                    className={cn(
                      "px-2 py-1 text-xs rounded-full font-semibold capitalize shadow",
                      getTaskStatusColor(project.status)
                    )}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {project.description}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-indigo-500 font-medium">Progress</span>
                    <span className="font-semibold text-indigo-700">{projectProgress}%</span>
                  </div>
                  <Progress
                    value={projectProgress}
                    className="h-2 bg-indigo-100"
                  />
                </div>
                {/* Animated background accent */}
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-tr from-indigo-200 to-blue-200 rounded-full opacity-30 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              </div>
            );
          })
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