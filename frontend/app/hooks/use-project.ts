import type { CreateProjectFormdata } from "@/components/project/create-project"
import { fetchData, postData } from "@/lib/fetch-utils"
import { queryClient } from "@/provider/react-query-provider"
import { useMutation, useQuery } from "@tanstack/react-query"



export const UseCreateProject = () => {
    return useMutation({
        mutationFn: async(data: {
            projectData: CreateProjectFormdata,
            workspaceId: string
        }) => postData(`/projects/${data.workspaceId}/create-project`, data.projectData),
        onSuccess: (data : any) => {
            queryClient.invalidateQueries({
                queryKey: ["workspace", data.workspace],
            })
        },
    })
}

export const UseProjectQuery = (projectId: string) => {
    console.log(projectId)
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: async () => await fetchData(`/projects/${projectId}/tasks`),
    })
}