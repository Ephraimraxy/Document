import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface UploadProgressProps {
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error" | "cancelled";
  error?: string;
  onCancel?: () => void;
  size?: string;
}

export function UploadProgress({ 
  fileName, 
  progress, 
  status, 
  error, 
  onCancel,
  size 
}: UploadProgressProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "uploading":
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
      case "cancelled":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "uploading":
        return `Uploading... ${progress.toFixed(1)}%`;
      case "success":
        return "Upload complete";
      case "error":
        return error || "Upload failed";
      case "cancelled":
        return "Upload cancelled";
      default:
        return "Preparing...";
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "error":
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              {getStatusIcon()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate" title={fileName}>
                {fileName}
              </p>
              {size && (
                <p className="text-xs text-muted-foreground">{size}</p>
              )}
            </div>
          </div>
          {status === "uploading" && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0 flex-shrink-0"
              data-testid="button-cancel-upload"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {getStatusText()}
            </span>
            {status === "uploading" && (
              <span className="text-xs font-medium">
                {progress.toFixed(1)}%
              </span>
            )}
          </div>
          
          <Progress 
            value={progress} 
            className="h-2"
            data-testid="upload-progress"
          />
        </div>
      </CardContent>
    </Card>
  );
}