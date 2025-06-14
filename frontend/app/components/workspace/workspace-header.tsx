import type { User, Workspace } from "@/types";
import { WorkspaceAvatar } from "./workspace-avatar";
import { Button } from "../ui/button";
import { Plus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface WorkspaceHeaderProps {
    workspace: Workspace;
    members:
    {
        _id: string;
        user: User;
        role: "admin" | "member" | "owner" | "viewer";
        joinedAt: Date;
    }[];
    onCreateProject: () => void
    onInviteMember: () => void
}

const WorkspaceHeader = ({
    workspace,
    members,
    onCreateProject,
    onInviteMember
}: WorkspaceHeaderProps) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="space-y-3">
                <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3">
                    <div className="flex md:items-center gap-3">
                        {workspace?.color && (
                            <WorkspaceAvatar name={workspace.name} color={workspace.color} />
                        )}
                        <h2 className="text-2xl md:text-3xl font-semibold font-[Inter] text-indigo-900 tracking-tight drop-shadow-sm flex items-center gap-2">
                            {workspace.name}
                        </h2>
                    </div>
                    <div className="flex gap-3 items-center justify-between md:justify-start mb-4 md:mb-0">
                        <Button
                            variant={'outline'}
                            onClick={onInviteMember}
                            className="flex items-center gap-2 border-indigo-200 hover:bg-indigo-50 transition-all"
                        >
                            <UserPlus className="size-4 mr-2 text-indigo-500" />
                            <span className="font-medium text-indigo-700">Invite Member</span>
                        </Button>
                        <Button
                            onClick={onCreateProject}
                            className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                        >
                            <Plus className="size-4 mr-2" />
                            <span className="font-medium">Create Project</span>
                        </Button>
                    </div>
                </div>
                {workspace.description && (
                    <p className="text-muted-foreground text-sm md:text-base font-[Inter]">
                        {workspace.description}
                    </p>
                )}
            </div>
            {members.length > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground font-medium">Members</span>
                    <div className="flex space-x-2">
                        {members.map((member) => (
                            <Avatar
                                key={member._id}
                                className="relative h-8 w-8 rounded-full border-2 border-background overflow-hidden shadow group transition-transform duration-200 hover:scale-110"
                                title={member.user.name}
                            >
                                <AvatarImage src={member.user.profilePicture} />
                                <AvatarFallback>
                                    {member.user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                </div>
            )}
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

export default WorkspaceHeader