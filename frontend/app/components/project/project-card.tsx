import type { Project } from '@/types';
import React from 'react'
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { getTaskStatusColor } from '@/lib';
import { format } from 'date-fns';
import { Progress } from '../ui/progress';
import { FolderKanban } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  progress: number;
  workspaceId: string;
}

const ProjectCard = ({
  project,
  progress,
  workspaceId
}: ProjectCardProps) => {
  return (
    <Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
      <Card className="relative cursor-pointer transition-all hover:shadow-xl hover:-translate-y-2 duration-300 ease-in-out bg-white/90 border-0 rounded-xl group overflow-hidden">
        {/* Animated accent circle */}
        <div className="absolute -right-8 -top-8 w-20 h-20 bg-gradient-to-tr from-indigo-200 to-blue-200 rounded-full opacity-20 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-indigo-400 animate-pop" />
              <CardTitle className="text-lg font-semibold font-[Inter] text-indigo-800 group-hover:text-indigo-600 transition-colors">
                {project.title}
              </CardTitle>
            </div>
            <span
              className={cn(
                'px-2 py-1 text-xs rounded-full font-semibold capitalize shadow',
                getTaskStatusColor(project.status)
              )}
            >
              {project.status}
            </span>
          </div>
          <CardDescription className="line-clamp-2 text-indigo-500 mt-2">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-indigo-500 font-medium">Progress</span>
                <span className="font-semibold text-indigo-700">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-indigo-100" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm gap-2 text-muted-foreground">
                <span className="font-semibold text-indigo-700">{project.tasks.length}</span>
                <span>Tasks</span>
              </div>
              {project.dueDate && (
                <div className="flex items-center text-xs text-indigo-400">
                  <span>{format(project.dueDate, 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <style>
          {`
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
    </Link>
  )
}

export default ProjectCard