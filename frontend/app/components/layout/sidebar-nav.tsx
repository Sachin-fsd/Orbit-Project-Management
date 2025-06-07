import { cn } from "@/lib/utils";
import type { Workspace } from "@/routes/types";
import type { LucideIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    currentWorkspace: Workspace | null;
    isCollapsed: boolean;
    className?: string;
    items: {
        title: string;
        icon: LucideIcon;
        href: string;
    }[];
}


export const SidebarNav = ({
    currentWorkspace,
    isCollapsed,
    className,
    items,
    ...props
}: SidebarNavProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <nav
            {...props}
            className={cn("flex flex-col gap-y-2", className)} {...props}
        >
            {items.map((el) => {
                const Icon = el.icon;
                const isActive = location.pathname === el.href;
                const handleClick = () => {
                    if (el.href === "/workspaces") {
                        navigate(el.href);
                    } else if (currentWorkspace && currentWorkspace._id) {
                        navigate(`${el.href}?workspaceId=${currentWorkspace._id}`);
                    } else {
                        navigate(el.href);
                    }
                }
                return (
                    <Button
                        key={el.href}
                        variant={isActive ? "outline" : "ghost"}
                        size="icon"
                        className={cn("justify-start", isActive && "bg-primary/10")}
                        onClick={handleClick}
                    >
                        <Icon className="mr-2 size-4" />
                        {
                            isCollapsed ? (
                                <span className="sr-only">{el.title}</span>
                            ) : (
                                <span>{el.title}</span>
                            )
                        }
                    </Button>
                )
            })}
        </nav>
    )
}