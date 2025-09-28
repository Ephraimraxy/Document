import { useNotifications } from "@/hooks/useNotifications";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Notifications() {
  const { notifications, loading } = useNotifications();
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);
  const { toast } = useToast();
  const { sidebarWidth } = useSidebar();

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setMarkingAsRead(notificationId);
      await apiRequest("PATCH", `/api/notifications/${notificationId}/read`);
      toast({
        title: "Notification marked as read",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Failed to mark notification as read",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setMarkingAsRead(null);
    }
  };

  const getNotificationIcon = () => {
    return "🔔";
  };

  if (loading) {
    return (
      <div className={`${sidebarWidth} min-h-screen transition-all duration-300`}>
        <Header 
          title="Notifications" 
          subtitle="Stay updated with your document activities" 
        />
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${sidebarWidth} min-h-screen transition-all duration-300`}>
      <Header 
        title="Notifications" 
        subtitle="Stay updated with your document activities" 
      />
      
      <main className="p-6">
        <div className="space-y-4">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`transition-all ${
                  !notification.read 
                    ? "border-primary/50 bg-primary/5" 
                    : "bg-card"
                }`}
                data-testid={`notification-${notification.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 text-2xl">
                        {getNotificationIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(new Date(notification.createdAt!))} ago
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markingAsRead === notification.id}
                        data-testid={`button-mark-read-${notification.id}`}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card data-testid="no-notifications">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <div className="text-muted-foreground">
                    No notifications yet.
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    You'll receive notifications about document activities here.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}