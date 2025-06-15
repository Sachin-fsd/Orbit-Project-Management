import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  ListCheck,
  LogOut,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "./sidebar-nav";

const navGradient =
  "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-md";

export const SidebarComponent = ({
  currentWorkspace,
}: {
  currentWorkspace: Workspace | null;
}) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Get workspaceId from localStorage
  const workspaceId = localStorage.getItem("selectedWorkspaceId");

  const navItems = [
    {
      title: "Dashboard",
      href: `/dashboard${workspaceId ? `?workspaceId=${workspaceId}` : ""}`,
      icon: LayoutDashboard,
      color: "text-blue-500",
    },
    {
      title: "Workspaces",
      href: "/workspaces",
      icon: Users,
      color: "text-indigo-500",
    },
    {
      title: "My Tasks",
      href: `/my-tasks${workspaceId ? `?workspaceId=${workspaceId}` : ""}`,
      icon: ListCheck,
      color: "text-purple-500",
    },
    {
      title: "Members",
      href: `/members${workspaceId ? `?workspaceId=${workspaceId}` : ""}`,
      icon: Users,
      color: "text-pink-500",
    },
    {
      title: "Settings",
      href: `/settings${workspaceId ? `?workspaceId=${workspaceId}` : ""}`,
      icon: Settings,
      color: "text-amber-500",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-gradient-to-b from-blue-50 via-white to-indigo-100 transition-all duration-500 shadow-xl",
        isCollapsed ? "w-16 md:w-[70px]" : "w-16 md:w-[250px]"
      )}
      style={{
        minHeight: "100vh",
        backdropFilter: "blur(6px)",
      }}
    >
      {/* Logo & Collapse */}
      <div
        className={cn(
          "flex h-16 items-center border-b px-4 mb-4 bg-white/70 transition-all duration-500 shadow-sm"
        )}
      >
        <Link to="/dashboard" className="flex items-center group">
          <div
            className={cn(
              "flex items-center gap-2 transition-all duration-300",
              isCollapsed ? "justify-center" : ""
            )}
          >
            <FolderKanban className="size-7 text-indigo-600 animate-spin-slow group-hover:rotate-180 transition-transform duration-700" />
            {!isCollapsed && (
              <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-wide drop-shadow">
                Orbit
              </span>
            )}
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto rounded-full hover:bg-indigo-100 transition"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="size-6 text-indigo-600" />
          ) : (
            <ChevronLeft className="size-6 text-indigo-600" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-2">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href.split("?")[0]);
            return (
              <Link
                key={item.title}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition-all duration-300 group",
                  isActive
                    ? `${navGradient} scale-105 shadow-lg`
                    : "hover:bg-indigo-50 hover:scale-105",
                  isCollapsed && "justify-center px-2"
                )}
                style={{
                  boxShadow: isActive
                    ? "0 2px 12px 0 rgba(99,102,241,0.15)"
                    : undefined,
                }}
              >
                <item.icon
                  className={cn(
                    "size-5 transition-transform duration-300 group-hover:scale-125",
                    item.color
                  )}
                />
                {!isCollapsed && (
                  <span
                    className={cn(
                      "transition-opacity duration-300",
                      isCollapsed ? "opacity-0" : "opacity-100"
                    )}
                  >
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User & Logout */}
      <div className="px-2 py-4 border-t bg-white/80 shadow-inner">
        {!isCollapsed && user && (
          <div className="flex items-center gap-2 mb-2 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center text-white font-bold shadow">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-sm font-semibold text-indigo-700 truncate">
              {user.name}
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-full justify-start hover:bg-red-50 transition group",
            isCollapsed && "justify-center"
          )}
          onClick={logout}
        >
          <LogOut
            className={cn(
              "size-5 text-red-500 group-hover:scale-110 transition-transform duration-200",
              isCollapsed && "mr-0"
            )}
          />
          {!isCollapsed && (
            <span className="ml-2 text-red-600 font-medium group-hover:underline">
              Logout
            </span>
          )}
        </Button>
      </div>
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.7s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-spin-slow {
            animation: spin 2.5s linear infinite;
          }
        `}
      </style>
    </div>
  );
};