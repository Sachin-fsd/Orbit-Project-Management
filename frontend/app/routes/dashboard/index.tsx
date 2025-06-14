import { RecentProjects } from "@/components/dashboard/recent-projects";
import { StatsCard } from "@/components/dashboard/stat-card";
import { StatisticsCharts } from "@/components/dashboard/statistics-chart";
import { Loader } from "@/components/loader";
import NoDataFound from "@/components/no-data-found";
import { UpcomingTasks } from "@/components/upcoming-task";
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types";
import { useSearchParams } from "react-router";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId!) as {
    data: {
      stats: StatsCardProps;
      taskTrendsData: TaskTrendsData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: WorkspaceProductivityData[];
      upcomingTasks: Task[];
      recentProjects: Project[];
    };
    isPending: boolean;
  };

  if (workspaceId === null || workspaceId === undefined) {
    return (
      <NoDataFound
        title="No workspace Selected"
        description="Please select a workspace to view the dashboard"
        buttonText="Create workspace"
        buttonAction={() => {}}
      />
    );
  }

  if (isPending) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-10 2xl:space-y-16 px-2 md:px-4 animate-fade-in">
      {/* Dashboard Title */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow">
          Dashboard
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="w-full">
        <StatsCard data={data.stats} />
      </div>
      <div className="w-full">
        <StatisticsCharts
            stats={data.stats}
            taskTrendsData={data.taskTrendsData}
            projectStatusData={data.projectStatusData}
            taskPriorityData={data.taskPriorityData}
            workspaceProductivityData={data.workspaceProductivityData}
          />
      </div>

      {/* Main Content: Projects & Upcoming Tasks */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Projects (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <RecentProjects data={data.recentProjects} />
          
        </div>
        {/* Upcoming Tasks (1/3 width) */}
        <div className="flex flex-col gap-8">
          <UpcomingTasks data={data.upcomingTasks} />
        </div>
      </div>

      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.8s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;