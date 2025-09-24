import { useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

export default function NotificationToast() {
  const { notifications } = useNotifications();
  const { toast } = useToast();

  useEffect(() => {
    // Show toast for new notifications
    if (notifications && notifications.length > 0) {
      const latestNotification = notifications[0];
      if (!latestNotification.read) {
        toast({
          title: latestNotification.title,
          description: latestNotification.message,
          action: (
            <div className="flex items-center">
              <Bell className="h-4 w-4" />
            </div>
          ),
        });
      }
    }
  }, [notifications, toast]);

  return null;
}
