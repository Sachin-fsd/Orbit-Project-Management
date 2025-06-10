import type { WorkspaceForm } from "@/components/workspace/create-workspace";
import { fetchData, postData } from "@/lib/fetch-utils";
import { useMutation, useQuery } from "@tanstack/react-query";


export const useCreateWorkspace = () => {
    return useMutation({
        mutationFn: async (data: WorkspaceForm) => await postData("/workspaces", data),
    });
}

export const useGetWorkspacesQuery = () => {
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => await fetchData("/workspaces"),
    });
}

export const useGetWokspaceQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: async () => await fetchData(`/workspaces/${workspaceId}/projects`),
    });
}