import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  FileText,
  LayoutDashboard,
  Plus,
  Folder,
  Inbox,
  Bell,
  LogOut,
} from "lucide-react";

export default function Navigation() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/create", icon: Plus, label: "Create Document" },
    { path: "/documents", icon: Folder, label: "My Documents" },
    { path: "/received", icon: Inbox, label: "Received" },
    {
      path: "/notifications",
      icon: Bell,
      label: "Notifications",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  if (!user) return null;

  const getUserInitials = (name: string) => {
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
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">DocFlow</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;

            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
              <span className="text-secondary-foreground text-sm font-medium">
                {getUserInitials(user.name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate" data-testid="text-username">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate" data-testid="text-department">
                {user.departmentId}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
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
