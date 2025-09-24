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
  LogOut 
} from "lucide-react";

interface SidebarProps {
  unreadCount?: number;
}

export default function Sidebar({ unreadCount = 0 }: SidebarProps) {
  const { userProfile, logout } = useAuth();
  const [location] = useLocation();

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

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border shadow-sm">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-border">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mr-3">
            <FileText className="text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">DocFlow</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
              <span className="text-secondary-foreground text-sm font-medium">
                {userProfile ? getInitials(userProfile.name) : "U"}
              </span>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
