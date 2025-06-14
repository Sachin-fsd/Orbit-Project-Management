import type { Project } from '@/types'
import React from 'react'
import NoDataFound from '../no-data-found'
import ProjectCard from '../project/project-card'
import { PlusCircle } from 'lucide-react'

interface ProjectListProps {
    workspaceId: string
    projects: Project[]
    onCreateProject: () => void
}

const ProjectList = ({
    workspaceId,
    projects,
    onCreateProject
}: ProjectListProps) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-semibold font-[Inter] text-indigo-900 tracking-tight drop-shadow-sm flex items-center gap-2">
                    Projects
                </h3>
                <button
                    onClick={onCreateProject}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow transition-all duration-200"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span className="font-medium">Create Project</span>
                </button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {
                    projects.length === 0 ? (
                        <NoDataFound
                            title="No projects found"
                            description="Create a new project to get started"
                            buttonText="Create Project"
                            buttonAction={onCreateProject}
                        />
                    ) : (
                        projects.map((project) => {
                            const projectProgress = 0;
                            return <ProjectCard
                                progress={projectProgress}
                                key={project._id}
                                project={project}
                                workspaceId={workspaceId}
                            />
                        })
                    )
                }
            </div>
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
    )
}

export default ProjectList