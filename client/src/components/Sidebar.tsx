import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { 
  FileText, 
  LayoutDashboard, 
  Plus, 
  Folder, 
  Inbox, 
  Bell, 
  LogOut,
  Menu,
  ChevronLeft
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/contexts/SidebarContext";

interface SidebarProps {
  unreadCount?: number;
}

export default function Sidebar({ unreadCount = 0 }: SidebarProps) {
  const { userProfile, logout } = useAuth();
  const [location] = useLocation();
  const { isCollapsed, toggle } = useSidebar();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Create Document", href: "/create", icon: Plus },
    { name: "My Documents", href: "/documents", icon: Folder },
    { name: "Received", href: "/received", icon: Inbox },
    { name: "Notifications", href: "/notifications", icon: Bell, badge: unreadCount },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  const renderNavButton = (item: any) => {
    const isActive = location === item.href;
    const buttonContent = (
      <Button
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "w-full",
          isCollapsed ? "justify-center px-0" : "justify-start",
          isActive && "bg-primary text-primary-foreground"
        )}
        data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
        {!isCollapsed && (
          <>
            {item.name}
            {item.badge && item.badge > 0 && (
              <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}
        {isCollapsed && item.badge && item.badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </Button>
    );

    if (isCollapsed) {
      return (
        <Tooltip key={item.name}>
          <TooltipTrigger asChild>
            <Link href={item.href}>
              <div className="relative">
                {buttonContent}
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Link key={item.name} href={item.href}>
        {buttonContent}
      </Link>
    );
  };

  return (
    <div className={cn("fixed inset-y-0 left-0 bg-card border-r border-border shadow-sm transition-all duration-300", sidebarWidth)}>
      <div className="flex flex-col h-full">
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <FileText className="text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-semibold text-foreground ml-3">DocFlow</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            data-testid="button-toggle-sidebar"
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => renderNavButton(item))}
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-border">
          <div className={cn("flex items-center", isCollapsed && "justify-center")}>
            <div className={cn("w-8 h-8 bg-secondary rounded-full flex items-center justify-center", !isCollapsed && "mr-3")}>
              <span className="text-secondary-foreground text-sm font-medium">
                {userProfile ? getInitials(userProfile.name) : "U"}
              </span>
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {userProfile?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {userProfile?.departmentId || "Department"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
            {isCollapsed && (
              <div className="absolute bottom-4 right-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logout}
                      data-testid="button-logout"
                      className="h-8 w-8 p-0"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
