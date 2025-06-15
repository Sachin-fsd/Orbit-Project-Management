import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { Button } from "../ui/button";
import { Bell, PlusCircle, ChevronDown, ChevronUp, UserCircle2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";
import { useEffect, useState } from "react";

interface HeaderProps {
  onWorkspaceSelected: (workspace: Workspace) => void;
  selectedWorkspace: Workspace | null;
  onCreateWorkspace: () => void;
}

export const Header = ({
  onWorkspaceSelected,
  selectedWorkspace,
  onCreateWorkspace,
}: HeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const loaderData = useLoaderData() as { workspaces?: Workspace[] } | undefined;
  const [wsMenuOpen, setWsMenuOpen] = useState(false);

  if (!loaderData || !loaderData.workspaces) {
    navigate("/sign-in");
    return null;
  }

  const { workspaces } = loaderData;
  useEffect(() => {
    const savedId = localStorage.getItem("selectedWorkspaceId");
    if (savedId && workspaces.length > 0) {
      const ws = workspaces.find(w => w._id === savedId);
      if (ws) {
        onWorkspaceSelected(ws);
      }
    }
    // eslint-disable-next-line
  }, [workspaces]);
  const isOnWorkspacePage = useLocation().pathname.includes("workspace");

  const handleOnClick = (workspace: Workspace) => {
    onWorkspaceSelected(workspace);
    const location = window.location;
    if (isOnWorkspacePage) {
      navigate(`/workspaces/${workspace._id}`);
    } else {
      const basePath = location.pathname;
      navigate(`${basePath}?workspaceId=${workspace._id}`);
    }
    setWsMenuOpen(false);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-100 sticky top-0 z-40 border-b shadow-md transition-all duration-500">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 py-3 animate-fade-in">
        {/* Workspace Dropdown */}
        <DropdownMenu open={wsMenuOpen} onOpenChange={setWsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm bg-white/80 hover:bg-indigo-50 transition-all duration-200"
            >
              {selectedWorkspace ? (
                <>
                  {selectedWorkspace.color && (
                    <WorkspaceAvatar
                      color={selectedWorkspace.color}
                      name={selectedWorkspace.name}
                    />
                  )}
                  <span className="font-medium text-indigo-700">
                    {selectedWorkspace?.name}
                  </span>
                </>
              ) : (
                <span className="font-medium text-indigo-400">
                  Select Workspace
                </span>
              )}
              {wsMenuOpen ? (
                <ChevronUp className="ml-1 w-4 h-4 text-indigo-400" />
              ) : (
                <ChevronDown className="ml-1 w-4 h-4 text-indigo-400" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="animate-slide-down-fade">
            <DropdownMenuLabel className="text-indigo-700">
              Workspaces
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws._id}
                  onClick={() => handleOnClick(ws)}
                  className="flex items-center gap-2 hover:bg-indigo-50 transition"
                >
                  {ws.color && (
                    <WorkspaceAvatar color={ws.color} name={ws.name} />
                  )}
                  <span className="font-medium">{ws.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  setWsMenuOpen(false);
                  onCreateWorkspace();
                }}
                className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-100 transition"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right Side: Notification & User */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-indigo-50 transition"
            aria-label="Notifications"
          >
            <Bell className="text-indigo-400 hover:text-indigo-600 transition-all duration-200 animate-bounce-slow" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full border p-1 w-9 h-9 bg-white/90 shadow hover:scale-105 transition-all duration-200">
                <Avatar className="w-8 h-8 bg-white">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} />
                  ) : (
                    <UserCircle2 className="w-7 h-7 text-indigo-400" />
                  )}
                  <AvatarFallback className="bg-primary text-primary-foreground capitalize">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="animate-slide-down-fade">
              <DropdownMenuLabel className="text-indigo-700">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/user/profile" className="flex items-center gap-2">
                  <UserCircle2 className="w-4 h-4 text-indigo-400" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.7s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-slide-down-fade {
            animation: slideDownFade 0.3s;
          }
          @keyframes slideDownFade {
            from { opacity: 0; transform: translateY(-10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-bounce-slow {
            animation: bounce 2.5s infinite;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-5px);}
          }
        `}
      </style>
    </div>
  );
};