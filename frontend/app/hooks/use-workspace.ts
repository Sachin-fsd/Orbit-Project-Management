import type { WorkspaceForm } from "@/components/workspace/create-workspace";
import { deleteData, fetchData, postData, updateData } from "@/lib/fetch-utils";
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

export const useGetWorkspaceStatsQuery = (workspaceId: string) => {
    console.log("workspaceId in fetch", workspaceId)
    return useQuery({
        queryKey: ["workspace", workspaceId, "stats"],
        queryFn: async () => await fetchData(`/workspaces/${workspaceId}/stats`),
    });
}

export const useGetWorkspaceDetailsQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId, "details"],
        queryFn: async () => await fetchData(`/workspaces/${workspaceId}`),
    });
}

export const useInviteMemberMutation = () => {
    return useMutation({
        mutationFn: async (data: { email: string, role: string, workspaceId: string }) => await postData(`/workspaces/${data.workspaceId}/invite-member`, data),
    });
}

export const useAcceptInviteByTokenMutation = () => {
    return useMutation({
        mutationFn: async (token: string) => postData(`/workspaces/accept-invite-token`, { token }),
    });
}

export const useAcceptGenerateInviteMutation = () => {
    return useMutation({
        mutationFn: async (workspaceId: string) => postData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
    });
}

export const useUpdateWorkspaceMutation = () => {
  return useMutation({
    mutationFn: async (data: { workspaceId: string; name?: string; description?: string; color?: string }) =>
      await updateData(`/workspaces/${data.workspaceId}`, data),
  });
};

export const useDeleteWorkspaceMutation = () => {
  return useMutation({
    mutationFn: async ({ workspaceId }: { workspaceId: string }) =>
      await deleteData(`/workspaces/${workspaceId}`),
  });
};

export const useTransferOwnershipMutation = () => {
  return useMutation({
    mutationFn: async ({ workspaceId, newOwnerId }: { workspaceId: string; newOwnerId: string }) =>
      await postData(`/workspaces/${workspaceId}/transfer-ownership`, { newOwnerId }),
  });
};

export const useRemoveMemberMutation = () => {
  return useMutation({
    mutationFn: async ({ workspaceId, userId }: { workspaceId: string; userId: string }) =>
      await postData(`/workspaces/${workspaceId}/remove-member`, { userId }),
  });
};