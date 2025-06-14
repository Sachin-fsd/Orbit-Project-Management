import NoDataFound from '@/components/no-data-found';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateWorkspace } from '@/components/workspace/create-workspace';
import { WorkspaceAvatar } from '@/components/workspace/workspace-avatar';
import { useGetWorkspacesQuery } from '@/hooks/use-workspace';
import type { Workspace } from '@/types';
import { Loader2, PlusCircle, Users } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from 'react-router';
import { format } from 'date-fns';

// You can import a Google Font in your main index.html or use a font utility class if using Tailwind (e.g., font-display, font-sans, font-serif, etc.)

const Workspaces = () => {
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
        data: Workspace[],
        isLoading: boolean
    }

    if (isLoading) return <Loader2 className="w-10 h-10 animate-spin mx-auto mt-20 text-indigo-400" />
    return (
        <>
            <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-semibold font-[Inter] text-indigo-900 tracking-tight drop-shadow-sm">
                            Workspaces
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setIsCreatingWorkspace(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow transition-all duration-200"
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Create Workspace
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {workspaces.map((ws) => (
                        <WorkspaceCard key={ws._id} workspace={ws} />
                    ))}

                    {workspaces.length === 0 && (
                        <NoDataFound
                            title="No workspaces found"
                            description="Create a new workspace to get started"
                            buttonText="Create Workspace"
                            buttonAction={() => setIsCreatingWorkspace(true)}
                        />
                    )}
                </div>
            </div>

            <CreateWorkspace
                isCreatingWorkspace={isCreatingWorkspace}
                setIsCreatingWorkspace={setIsCreatingWorkspace}
            />
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
        </>
    )
}

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
    return (
        <Link to={`/workspaces/${workspace._id}`}>
            <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 bg-white/90 border-0 rounded-xl group relative overflow-hidden">
                {/* Animated accent circle */}
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-tr from-indigo-200 to-blue-200 rounded-full opacity-20 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3 items-center">
                            <WorkspaceAvatar name={workspace.name} color={workspace.color} />
                            <div>
                                <CardTitle className="text-lg font-semibold font-[Inter] text-indigo-800 group-hover:text-indigo-600 transition-colors">
                                    {workspace.name}
                                </CardTitle>
                                <span className="text-xs text-muted-foreground">
                                    Created {format(workspace.createdAt, 'MMM d, yyyy h:mm a')}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                            <Users className="size-4 mr-1 text-indigo-400" />
                            <span className="text-sm">{workspace.members.length}</span>
                        </div>
                    </div>
                    <CardDescription className="mt-2 text-sm text-indigo-500">
                        {workspace.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-indigo-400 font-medium group-hover:text-indigo-600 transition-colors">
                        View Workspace Details &rarr;
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default Workspaces;