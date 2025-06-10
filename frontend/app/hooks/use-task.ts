import type { CreateTaskFormData } from "@/components/task/create-task-dialog";
import { postData } from "@/lib/fetch-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";



export const useCreateTaskMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { taskData: CreateTaskFormData; projectId: string }) => 
            postData(`/tasks/${data.projectId}/create-task`, data.taskData),
        onSuccess: (data : any) => {
            queryClient.invalidateQueries({
                queryKey: ["project", data.project],
            });
        },
    });
};
