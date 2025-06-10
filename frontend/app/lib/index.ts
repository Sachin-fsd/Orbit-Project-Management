import type { ProjectStatus, TaskStatus } from "@/types";

export const publicRoutes = ['/', '/sign-in', '/sign-up', '/verify-email', '/forgot-password', '/reset-password'];


export const getTaskStatusColor = (status: ProjectStatus) => {
    switch (status) {
        case "COMPLETED":
            return "bg-green-100 text-green-800";
        case "IN PROGRESS":
            return "bg-blue-100 text-blue-800";
        case "CANCELLED":
            return "bg-red-100 text-red-800";
        case 'ON HOLD':
            return "bg-yellow-100 text-yellow-800";
        case 'PLANNING':
            return "bg-purple-100 text-purple-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}

export const getProjectProgress = (tasks : {status : TaskStatus} []) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task?.status === "COMPLETED").length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return progress;
}