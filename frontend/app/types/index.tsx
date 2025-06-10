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
    assgnees: User[];
    subtasks?: Subtask[];
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