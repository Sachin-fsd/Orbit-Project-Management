export interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    isEmailVerified: boolean;
    updatedAt: Date;
    profilePicture?: string;
}

export interface Workspace {
    _id: string;
    name: string;
    description: string;
    owner: User;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    members: {
        user: User;
        role: "admin" | "member" | "owner" | "viewer";
        joinedAt: Date;
    }[];
}

export enum ProjectStatus {
    PLANNING = "PLANNING",
    IN_PROGRESS = "IN PROGRESS",
    ON_HOLD = "ON HOLD",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface Project {
    _id: string;
    title: string;
    description?: string;
    workspace: Workspace;
    status: ProjectStatus;
    createdAt: Date;
    updatedAt: Date;
    members: {
        user: User;
        role: "admin" | "member" | "owner" | "viewer";
    }[];
    startDate: Date;
    dueDate: Date;
    tasks: Task[];
    progress: number;
    isArchived: boolean;
}

export type TaskStatus = "To Do" | "In Progress" | "Review" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";

export interface Subtask {
    _id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    project: Project;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
    members: {
        user: User;
        role: "admin" | "member" | "owner" | "viewer";
    }[];
    startDate: Date;
    dueDate: Date;
    isArchived: boolean;
    priority: TaskPriority;
    assignee: User;
    createdBy: User;
    assignees: User[];
    subTasks?: Subtask[];
    watchers?: User[];
    attachments?: Attachments[];
}

export interface Attachments {
    _id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedBy: User;
    uploadedAt: Date;
}

export interface MemberProps {
    _id: string;
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
}

export enum ProjectMemberRole {
    MANAGER = "manager",
    CONTRIBUTOR = "contributor",
    VIEWER = "viewer"
}

export type ResourceType = 
| "Task"
| "Project"
| "Workspace"
| "Comment"
| "User";

export type ActionType = 
   | "created_task"
    | "updated_task"
    | "created_subtask"
    | "updated_subtask"
    | "completed_task"
    | "created_project"
    | "updated_project"
    | "completed_project"
    | "created_workspace"
    | "updated_workspace"
    | "added_comment"
    | "added_member"
    | "removed_member"
    | "joined_workspace"
    | "transferred_workspace_ownership"
    | "added_attachment";


    export interface ActivityLog {
    _id: string;
    user: User;
    action: ActionType;
    resourceType: ResourceType;
    resourceId: string;
    details: any;
    createdAt: Date;
}

export interface CommentReaction {
    emoji: string;
    user:User;
}

export interface Comment {
    _id: string;
    text: string;
    author: User;
    createdAt: Date;
    reactions: CommentReaction[];
    attachments?:{
        fileName: string;
        fileUrl: string;
        fileType?: string;
        fileSize?: number;
    }[]
}

export interface StatsCardProps {
    totalProjects: number;
    totalTasks: number;
    totalProjectInProgress: number;
    totalTaskCompleted: number;
    totalTaskToDo: number;
    totalTaskInProgress: number;
}

export interface TaskTrendsData {
    name: string;
    completed: number;
    inProgress: number;
    todo: number;
}

export interface ProjectStatusData {
    name: string;
    value: number;
    color: string;
}

export interface TaskPriorityData {
    name: string;
    value: number;
    color: string;
}

export interface WorkspaceProductivityData {
    name: string;
    completed: number;
    total: number;
}