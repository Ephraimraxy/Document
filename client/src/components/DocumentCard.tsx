import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { FileText, FileSpreadsheet, Presentation, Eye, Edit } from "lucide-react";
import type { Document } from "@shared/schema";

interface DocumentCardProps {
  document: Document;
  showSender?: boolean;
  onEdit?: (documentId: string) => void;
  onView?: (documentId: string) => void;
}

export default function DocumentCard({ 
  document, 
  showSender = false, 
  onEdit, 
  onView 
}: DocumentCardProps) {
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("word")) return FileText;
    if (fileType.includes("sheet")) return FileSpreadsheet;
    if (fileType.includes("presentation")) return Presentation;
    return FileText;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reviewed": return "bg-accent/20 text-accent";
      case "pending": return "bg-muted text-muted-foreground";
      case "overdue": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-destructive/20 text-destructive";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "medium": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const FileIcon = getFileIcon(document.fileType);

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`document-card-${document.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground" data-testid="document-title">
                {document.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {showSender 
                  ? `From: ${document.createdBy} • ${formatDistanceToNow(new Date(document.createdAt!))} ago`
                  : `Sent to: ${document.recipientDepartments.join(", ")} • ${formatDistanceToNow(new Date(document.createdAt!))} ago`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(document.status)} data-testid="document-status">
              {document.status}
            </Badge>
            <Badge className={getPriorityColor(document.priority)} data-testid="document-priority">
              {document.priority}
            </Badge>
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(document.id)}
                data-testid="button-view-document"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(document.id)}
                data-testid="button-edit-document"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
