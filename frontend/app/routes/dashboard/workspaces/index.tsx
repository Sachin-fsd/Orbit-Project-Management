

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
import {format} from 'date-fns';

const Workspaces = () => {
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
        data: Workspace[],
        isLoading: boolean
    }

    if (isLoading) return <Loader2 className="w-10 h-10 animate-spin" />
    return (
        <>
            <div className='space-y-8'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <h1 className='text-2xl font-bold'>Workspaces</h1>
                    </div>
                    <div className='flex items-center gap-4'>
                        <Button
                            onClick={() => setIsCreatingWorkspace(true)}
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                        >
                            <PlusCircle className='w-4 h-4 mr-2' />
                            Create Workspace
                        </Button>
                    </div>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    {workspaces.map((ws) => (
                        <WorkspaceCard key={ws._id} workspace={ws} />
                    ))}

                    {
                        workspaces.length === 0 && <NoDataFound
                            title="No workspaces found"
                            description="Create a new workspace to get started"
                            buttonText="Create Workspace"
                            buttonAction={() => setIsCreatingWorkspace(true)} />
                    }
                </div>
            </div>

            <CreateWorkspace
                isCreatingWorkspace={isCreatingWorkspace}
                setIsCreatingWorkspace={setIsCreatingWorkspace}
            />
        </>
    )
}

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
    return (
        <Link to={`/workspaces/${workspace._id}`}>
            <Card className='transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1'>
                <CardHeader className='pb-2'>
                    <div className='flex items-center justify-between '>
                        <div className='flex gap-2'>
                            <WorkspaceAvatar name={workspace.name} color={workspace.color} />
                            <div>
                                <CardTitle className='text-lg font-semibold'>{workspace.name}</CardTitle>
                                <span className='text-sm text-muted-foreground'>
                                    Created at {format(workspace.createdAt, 'MMM d, yyyy h:mm a')}
                                </span>
                            </div>
                        </div>
                        <div className='flex items-center text-muted-foreground'>
                            <Users className='size-4 mr-1' />
                            <span className='text-sm text-muted-foreground'>{workspace.members.length}</span>
                        </div>
                    </div>
                    <CardDescription>
                        {workspace.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='text-sm text-muted-foreground'>
                        View Workspace Details
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default Workspaces