import { useQuery } from "@tanstack/react-query";
import { Loader } from "../loader";
import type { ActivityLog } from "@/types";
import { getActivityIcon } from "./task-icon";
import { fetchData } from "@/lib/fetch-utils";

export const TaskActivity = ({ resourceId }: { resourceId: string }) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["task-activity", resourceId],
    queryFn: () => fetchData(`/tasks/${resourceId}/activity`),
  }) as {
    data: ActivityLog[];
    isPending: boolean;
    error?: any;
  };

  if (isPending) return <Loader />;
  if (error)
    return (
      <div className="bg-card rounded-lg p-6 shadow-sm text-red-500">
        Failed to load activity.
      </div>
    );

  return (
    <div className="bg-white/90 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold font-[Inter] text-indigo-900 mb-4">Activity</h3>
      <div className="space-y-4">
        {data?.length > 0 ? (
          data.map((activity) => (
            <div key={activity._id} className="flex gap-2 items-start">
              <div className="size-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 shadow">
                {getActivityIcon(activity.action)}
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  {activity.details?.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">No activity yet.</div>
        )}
      </div>
    </div>
  );
};