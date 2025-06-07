import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/routes/types";
import { ChevronLeft, ChevronRight, LayoutDashboard, ListCheck, LogOut, Settings, Users, Wrench } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "./sidebar-nav";

export const SidebarComponent = ({
    currentWorkspace,
}: {
    currentWorkspace: Workspace | null;
}) => {
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navItems = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard
        },
        {
            title: "Workspaces",
            href: "/workspaces",
            icon: Users
        },
        {
            title: "My Tasks",
            href: "/my-tasks",
            icon: ListCheck
        },
        {
            title: "Members",
            href: "/members",
            icon: Users
        },
        {
            title: "Settings",
            href: "/settings",
            icon: Settings
        },
    ];
    return <div className={cn("flex flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16 md:w[80px]" : "w-16 md:w-[240px]"
    )}>

        <div className="flex h-14 items-center border-b px-4 mb-4">
            <Link to="/dashboard" className="flex items-center">
                {
                    !isCollapsed && (
                        <div className="flex items-center gap-2">
                            <Wrench className="size-6 text-primary" />
                            <span className="text-lg font-bold hidden md:block">Orbit</span>
                        </div>
                    )
                }
                {
                    isCollapsed && <Wrench className="size-6 text-primary" />
                }
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsCollapsed(!isCollapsed)}>
                {
                    isCollapsed ? (
                        <ChevronRight className="size-6 text-primary" />
                    ) : (
                        <ChevronLeft className="size-6 text-primary" />
                    )
                }
            </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-2">
            <SidebarNav
                currentWorkspace={currentWorkspace}
                isCollapsed={isCollapsed}
                className={cn(isCollapsed && "items-center space-y-2")}
                items={navItems} />

        </ScrollArea>

        <div>
            <Button variant="ghost" size="icon" className="w-full justify-start" onClick={logout}>
                <LogOut className={cn("size-4", isCollapsed && "mr-2")} />
                <span className={cn("hidden md:block", isCollapsed && "text-sm")}>Logout</span>
            </Button>

        </div>
    </div>;
};