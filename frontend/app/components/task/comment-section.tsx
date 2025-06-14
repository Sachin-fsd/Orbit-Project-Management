import type { Comment, User } from "@/types";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  useAddCommentMutation,
  useGetCommentsByTaskIdQuery,
} from "@/hooks/use-task";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Loader } from "../loader";
import Pusher from "pusher-js";
import { usePusher } from "@/provider/pusher-context";

export const CommentSection = ({
  taskId,
  members,
}: {
  taskId: string;
  members: User[];
}) => {
  const pusher = usePusher()
  const [newComment, setNewComment] = useState("");
  const [liveComments, setLiveComments] = useState<Comment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { mutate: addComment, isPending } = useAddCommentMutation();
  const { data: comments, isLoading, error, refetch } = useGetCommentsByTaskIdQuery(taskId) as {
    data: Comment[];
    isLoading: boolean;
    error?: any;
    refetch?: () => void;
  };

  // --- Pusher Setup ---
  useEffect(() => {
    if (!taskId) return;
    const channel = pusher.subscribe(`task-${taskId}`);
    const handler = (comment: Comment) => {
      setLiveComments((prev) => [...prev, comment]);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    };
    channel.bind("new-comment", handler);

    return () => {
      channel.unbind("new-comment", handler);
      pusher.unsubscribe(`task-${taskId}`);
    };
  }, [taskId]);

  useEffect(() => {
    setLiveComments([]);
  }, [taskId, comments]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    addComment(
      { taskId, text: newComment },
      {
        onSuccess: () => {
          setNewComment("");
          toast.success("Comment added successfully");
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Failed to add comment");
          console.log(error);
        },
      }
    );
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="bg-white/90 rounded-lg p-6 shadow-sm text-red-500">
        Failed to load comments.
      </div>
    );

  // Combine initial comments and live comments (avoid duplicates)
  const allComments = [
    ...liveComments.filter(
      (lc) => !(comments || []).some((c) => c._id === lc._id)
    ),
    ...(comments || []),

  ];

  return (
    <div className="bg-white/90 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold font-[Inter] text-indigo-900 mb-4">Comments</h3>
      <ScrollArea className="h-[300px] mb-4" ref={scrollRef}>
        {allComments.length > 0 ? (
          allComments.map((comment) => (
            <div key={comment._id} className="flex gap-4 py-2">
              <Avatar className="size-8">
                <AvatarImage src={comment.author.profilePicture} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No comment yet</p>
          </div>
        )}
      </ScrollArea>
      <Separator className="my-4" />
      <div className="mt-4">
        <Textarea
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <Button
            disabled={!newComment.trim() || isPending}
            onClick={handleAddComment}
            className="bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
          >
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
};