import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useGetWorkspaceDetailsQuery, useUpdateWorkspaceMutation, useDeleteWorkspaceMutation, useTransferOwnershipMutation, useRemoveMemberMutation } from "@/hooks/use-workspace";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Trash2, Sun, Moon, UserMinus, UserCheck, Crown } from "lucide-react";
import { colorOptions } from "@/components/workspace/create-workspace";
import { cn } from "@/lib/utils";
import { useTheme } from "@/provider/theme-context";

const Settings = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const { data: workspace, isLoading, refetch } = useGetWorkspaceDetailsQuery(workspaceId!) as {
    data: any;
    isLoading: boolean;
    refetch: () => void;
  };

  const [editName, setEditName] = useState(false);
  const [editDesc, setEditDesc] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [transferTo, setTransferTo] = useState<string | null>(null);

  const { mutate: updateWorkspace, isPending: isUpdating } = useUpdateWorkspaceMutation();
  const { mutate: deleteWorkspace, isPending: isDeleting } = useDeleteWorkspaceMutation();
  const { mutate: transferOwnership, isPending: isTransferring } = useTransferOwnershipMutation();
  const { mutate: removeMember, isPending: isRemoving } = useRemoveMemberMutation();

  if (isLoading || !workspace) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin w-8 h-8 text-indigo-400" />
      </div>
    );
  }

  const isOwner = workspace.owner?._id === workspace.currentUserId;

  // --- Handlers ---
  const handleNameChange = () => {
    updateWorkspace(
      { workspaceId, name: newName },
      {
        onSuccess: () => {
          toast.success("Workspace name updated!");
          setEditName(false);
          refetch();
        },
        onError: () => toast.error("Failed to update name"),
      }
    );
  };

  const handleDescChange = () => {
    updateWorkspace(
      { workspaceId, description: newDesc },
      {
        onSuccess: () => {
          toast.success("Workspace description updated!");
          setEditDesc(false);
          refetch();
        },
        onError: () => toast.error("Failed to update description"),
      }
    );
  };

  const handleColorChange = (color: string) => {
    updateWorkspace(
      { workspaceId, color },
      {
        onSuccess: () => {
          toast.success("Workspace color updated!");
          setSelectedColor(color);
          refetch();
        },
        onError: () => toast.error("Failed to update color"),
      }
    );
  };

  const handleDeleteWorkspace = () => {
    deleteWorkspace(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("Workspace deleted!");
          setShowDeleteDialog(false);
          navigate("/workspaces");
        },
        onError: () => toast.error("Failed to delete workspace"),
      }
    );
  };

  const handleTransferOwnership = () => {
    if (!transferTo) return;
    transferOwnership(
      { workspaceId, newOwnerId: transferTo },
      {
        onSuccess: () => {
          toast.success("Ownership transferred!");
          setShowTransferDialog(false);
          refetch();
        },
        onError: () => toast.error("Failed to transfer ownership"),
      }
    );
  };

  const handleRemoveMember = (userId: string) => {
    removeMember(
      { workspaceId, userId },
      {
        onSuccess: () => {
          toast.success("Member removed!");
          refetch();
        },
        onError: () => toast.error("Failed to remove member"),
      }
    );
  };

  // --- Render ---
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 animate-fade-in">
      <Card className="bg-white/90 shadow-lg border-0 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold font-[Inter] text-indigo-900 flex items-center gap-2">
            Workspace Settings
          </CardTitle>
          <CardDescription>Manage your workspace details and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-indigo-700">Name:</span>
              {editName ? (
                <>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-64"
                  />
                  <Button size="sm" onClick={handleNameChange} disabled={isUpdating || !newName.trim()}>
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditName(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-indigo-900">{workspace.name}</span>
                  {isOwner && (
                    <Button size="sm" variant="ghost" onClick={() => { setEditName(true); setNewName(workspace.name); }}>
                      Edit
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          {/* Description */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-indigo-700">Description:</span>
              {editDesc ? (
                <>
                  <Textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-80"
                  />
                  <Button size="sm" onClick={handleDescChange} disabled={isUpdating || !newDesc.trim()}>
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditDesc(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-indigo-900">{workspace.description || <span className="italic text-muted-foreground">No description</span>}</span>
                  {isOwner && (
                    <Button size="sm" variant="ghost" onClick={() => { setEditDesc(true); setNewDesc(workspace.description || ""); }}>
                      Edit
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          {/* Color */}
          <div>
            <span className="font-semibold text-indigo-700 mr-2">Color:</span>
            <div className="flex gap-2 items-center">
              {colorOptions.map((color) => (
                <div
                  key={color}
                  className={cn(
                    "w-7 h-7 rounded-full cursor-pointer border-2 border-white shadow transition-all duration-200",
                    (workspace.color === color || selectedColor === color)
                      ? "ring-2 ring-indigo-400 scale-110"
                      : "opacity-80 hover:opacity-100"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
          {/* Theme */}
          <div>
            <span className="font-semibold text-indigo-700 mr-2">Theme:</span>
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="mr-2"
              onClick={() => setTheme("light")}
            >
              <Sun className="mr-1 w-4 h-4" /> Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
            >
              <Moon className="mr-1 w-4 h-4" /> Dark
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Management */}
      <Card className="bg-white/90 shadow-lg border-0 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold font-[Inter] text-indigo-900 flex items-center gap-2">
            Members
          </CardTitle>
          <CardDescription>Manage workspace members and roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workspace.members.map((member: any) => (
              <div key={member.user._id} className="flex items-center gap-3 justify-between border-b py-2">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={member.user.profilePicture} />
                    <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-indigo-900">{member.user.name}</span>
                  {workspace.owner?._id === member.user._id && (
                    <Crown className="w-4 h-4 text-yellow-500" title="Owner" />
                  )}
                  <span className="text-xs text-muted-foreground ml-2 capitalize">{member.role}</span>
                </div>
                <div className="flex gap-2">
                  {isOwner && workspace.owner?._id !== member.user._id && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200"
                        onClick={() => handleRemoveMember(member.user._id)}
                        disabled={isRemoving}
                        title="Remove Member"
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-indigo-600 border-indigo-200"
                        onClick={() => { setShowTransferDialog(true); setTransferTo(member.user._id); }}
                        disabled={isTransferring}
                        title="Transfer Ownership"
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-white/90 shadow-lg border-0 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold font-[Inter] text-red-700 flex items-center gap-2">
            Danger Zone
          </CardTitle>
          <CardDescription>Delete this workspace permanently.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-5 h-5" />
            Delete Workspace
          </Button>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workspace</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-red-600 font-semibold mb-2">
              Are you sure you want to delete this workspace? This action cannot be undone.
            </p>
            <p className="text-muted-foreground">All projects and tasks will be permanently deleted.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWorkspace} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Ownership Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Ownership</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2">
              Are you sure you want to transfer ownership of this workspace to{" "}
              <span className="font-semibold text-indigo-700">
                {workspace.members.find((m: any) => m.user._id === transferTo)?.user.name}
              </span>
              ?
            </p>
            <p className="text-muted-foreground">
              You will lose owner privileges and become a member.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleTransferOwnership} disabled={isTransferring}>
              {isTransferring ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              Transfer Ownership
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
  );
};

export default Settings;