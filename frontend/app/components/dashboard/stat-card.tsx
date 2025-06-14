import type { StatsCardProps } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FolderKanban, ListCheck, Rocket, Loader2 } from "lucide-react";

export const StatsCard = ({ data }: { data: StatsCardProps }) => {
  const cards = [
    {
      title: "Total Projects",
      value: data.totalProjects,
      sub: `${data.totalProjectInProgress} in progress`,
      icon: <FolderKanban className="w-7 h-7 text-blue-500 animate-pop" />,
      bg: "from-blue-100 to-blue-50",
    },
    {
      title: "Total Tasks",
      value: data.totalTasks,
      sub: `${data.totalTaskCompleted} completed`,
      icon: <ListCheck className="w-7 h-7 text-indigo-500 animate-pop" />,
      bg: "from-indigo-100 to-indigo-50",
    },
    {
      title: "To Do",
      value: data.totalTaskToDo,
      sub: "Tasks waiting to be done",
      icon: <Loader2 className="w-7 h-7 text-purple-500 animate-spin-slow" />,
      bg: "from-purple-100 to-purple-50",
    },
    {
      title: "In Progress",
      value: data.totalTaskInProgress,
      sub: "Tasks currently in progress",
      icon: <Rocket className="w-7 h-7 text-pink-500 animate-pop" />,
      bg: "from-pink-100 to-pink-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      {cards.map((card, idx) => (
        <Card
          key={card.title}
          className={`relative overflow-hidden bg-gradient-to-br ${card.bg} shadow-lg border-0 group transition-transform duration-300 hover:scale-105`}
        >
          <div className="absolute right-2 top-2 opacity-20 group-hover:opacity-30 transition">
            {card.icon}
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-indigo-900 drop-shadow">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </CardContent>
        </Card>
      ))}
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
          .animate-spin-slow {
            animation: spin 2.5s linear infinite;
          }
        `}
      </style>
    </div>
  );
};