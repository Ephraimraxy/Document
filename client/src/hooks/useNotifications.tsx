import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";
import type { Notification } from "@shared/schema";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { userProfile } = useAuth();

  useEffect(() => {
    if (!userProfile) return;

    const q = query(
      collection(db, "notifications"),
      where("targetDepartments", "array-contains", userProfile.departmentId),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationList: Notification[] = [];
      let unread = 0;

      snapshot.forEach((doc) => {
        const notification = { id: doc.id, ...doc.data() } as Notification;
        notificationList.push(notification);
        if (!notification.read) {
          unread++;
        }
      });

      setNotifications(notificationList);
      setUnreadCount(unread);
    });

    return () => unsubscribe();
  }, [user]);

  return { notifications, unreadCount };
}
