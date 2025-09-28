import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Users, 
  Eye,
  Edit,
  Wifi,
  WifiOff
} from "lucide-react";

export interface LiveStatusProps {
  type: "document" | "user" | "connection";
  status: string;
  count?: number;
  className?: string;
}

export function LiveStatus({ type, status, count, className = "" }: LiveStatusProps) {
  const getStatusConfig = () => {
    if (type === "connection") {
      return status === "online" 
        ? { icon: Wifi, color: "bg-green-500", text: "Online" }
        : { icon: WifiOff, color: "bg-red-500", text: "Offline" };
    }

    if (type === "user") {
      switch (status) {
        case "viewing":
          return { icon: Eye, color: "bg-blue-500", text: `${count || 0} viewing` };
        case "editing":
          return { icon: Edit, color: "bg-orange-500", text: `${count || 0} editing` };
        case "online":
          return { icon: Users, color: "bg-green-500", text: `${count || 0} online` };
        default:
          return { icon: Users, color: "bg-gray-500", text: "Offline" };
      }
    }

    // Document status
    switch (status) {
      case "pending":
        return { icon: Clock, color: "bg-yellow-500", text: "Pending Review" };
      case "approved":
        return { icon: CheckCircle, color: "bg-green-500", text: "Approved" };
      case "rejected":
        return { icon: XCircle, color: "bg-red-500", text: "Rejected" };
      case "in_review":
        return { icon: AlertCircle, color: "bg-blue-500", text: "In Review" };
      case "draft":
        return { icon: Edit, color: "bg-gray-500", text: "Draft" };
      default:
        return { icon: Clock, color: "bg-gray-500", text: status };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={`flex items-center gap-1.5 px-2 py-1 ${className}`}
      data-testid={`status-${type}-${status}`}
    >
      <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`} />
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium">{config.text}</span>
    </Badge>
  );
}