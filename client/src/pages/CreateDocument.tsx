import { useState } from "react";
import { useForm } from "react-hook-form";
import { UploadProgress } from "@/components/ui/upload-progress";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { LiveStatus } from "@/components/ui/live-status";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, FileText, X } from "lucide-react";
import { useLocation } from "wouter";
import { useSidebar } from "@/contexts/SidebarContext";

const createDocumentSchema = z.object({
  title: z.string().min(1, "Document title is required"),
  description: z.string().optional(),
  recipientDepartments: z.array(z.string()).min(1, "Select at least one department"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string().optional(),
});

type CreateDocumentFormData = z.infer<typeof createDocumentSchema>;

const departments = [
  { id: "admin", name: "Admin" },
  { id: "accounts", name: "Accounts" },
  { id: "hr", name: "HR" },
  { id: "audit", name: "Audit" },
  { id: "ict", name: "ICT" },
  { id: "logistics", name: "Logistics" },
  { id: "marketing", name: "Marketing" },
];

export default function CreateDocument() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"uploading" | "success" | "error" | "cancelled">("uploading");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { sidebarWidth } = useSidebar();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateDocumentFormData>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: {
      priority: "medium",
      recipientDepartments: [],
    },
  });

  const watchedDepartments = watch("recipientDepartments");

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a DOCX, XLSX, or PPTX file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDepartmentChange = (departmentId: string, checked: boolean) => {
    const currentDepartments = watchedDepartments || [];
    if (checked) {
      setValue("recipientDepartments", [...currentDepartments, departmentId]);
    } else {
      setValue("recipientDepartments", currentDepartments.filter(id => id !== departmentId));
    }
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    setUploadStatus("uploading");
    setUploadError(null);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    
    return interval;
  };

  const cancelUpload = () => {
    setShowCancelDialog(true);
  };

  const confirmCancelUpload = () => {
    setUploadStatus("cancelled");
    setIsUploading(false);
    setUploadProgress(0);
    setShowCancelDialog(false);
    
    toast({
      title: "Upload cancelled",
      description: "Document upload has been cancelled.",
      variant: "default",
    });
  };

  const onSubmit = async (data: CreateDocumentFormData) => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const progressInterval = simulateUploadProgress();
    
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("recipientDepartments", JSON.stringify(data.recipientDepartments));
      formData.append("priority", data.priority);
      if (data.dueDate) {
        formData.append("dueDate", data.dueDate);
      }

      const response = await apiRequest("POST", "/api/documents", formData);
      
      // Complete the upload progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus("success");
      
      toast({
        title: "✅ Document created successfully",
        description: "Your document has been uploaded and shared with the selected departments.",
        variant: "default",
      });

      // Delay navigation to show success state
      setTimeout(() => {
        setLocation("/");
      }, 1500);
      
    } catch (error: any) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setUploadStatus("error");
      setUploadError(error.message || "Upload failed");
      
      toast({
        title: "❌ Failed to create document",
        description: error.message || "An error occurred while creating the document.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
      }, 2000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`${sidebarWidth} min-h-screen transition-all duration-300`}>
      <Header 
        title="Create Document" 
        subtitle="Upload and share a new document" 
      />
      
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create New Document</CardTitle>
              <CardDescription>
                Upload a document and share it with specific departments
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Document Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter document title"
                    {...register("title")}
                    data-testid="input-document-title"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                {/* Document Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    placeholder="Brief description of the document"
                    {...register("description")}
                    data-testid="textarea-description"
                  />
                </div>

                {/* Recipient Departments */}
                <div className="space-y-2">
                  <Label>Send to Departments</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {departments.map((dept) => (
                      <div key={dept.id} className="flex items-center space-x-2 p-3 border border-input rounded-md hover:bg-muted">
                        <Checkbox
                          id={dept.id}
                          checked={watchedDepartments?.includes(dept.id) || false}
                          onCheckedChange={(checked) => 
                            handleDepartmentChange(dept.id, checked as boolean)
                          }
                          data-testid={`checkbox-${dept.id}`}
                        />
                        <Label htmlFor={dept.id} className="text-sm cursor-pointer">
                          {dept.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.recipientDepartments && (
                    <p className="text-sm text-destructive">{errors.recipientDepartments.message}</p>
                  )}
                </div>

                {/* File Upload Section */}
                <div className="space-y-2">
                  <Label>Upload Document</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      dragOver 
                        ? "border-primary bg-muted" 
                        : "border-border hover:bg-muted/50"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onClick={() => document.getElementById("file-upload")?.click()}
                    data-testid="file-drop-zone"
                  >
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                      <CloudUpload className="text-2xl text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium mb-2">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Supports DOCX, PPTX, XLSX files up to 50MB
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".docx,.pptx,.xlsx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      data-testid="input-file"
                    />
                  </div>

                  {/* Upload Progress or File Preview */}
                  {isUploading && selectedFile ? (
                    <UploadProgress
                      fileName={selectedFile.name}
                      progress={uploadProgress}
                      status={uploadStatus}
                      error={uploadError || undefined}
                      onCancel={cancelUpload}
                      size={formatFileSize(selectedFile.size)}
                    />
                  ) : selectedFile ? (
                    <div className="p-4 bg-muted rounded-lg border border-border" data-testid="file-preview">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                          data-testid="button-remove-file"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Priority and Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      onValueChange={(value) => setValue("priority", value as any)}
                      defaultValue="medium"
                    >
                      <SelectTrigger data-testid="select-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      {...register("dueDate")}
                      data-testid="input-due-date"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setLocation("/")}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUploading}
                    data-testid="button-create-send"
                  >
                    {isUploading ? "Creating..." : "Create & Send"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Upload Cancel Confirmation Dialog */}
      <ConfirmationDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Upload?"
        description="Are you sure you want to cancel the upload? All progress will be lost."
        confirmText="Yes, Cancel"
        cancelText="Continue Upload"
        variant="warning"
        onConfirm={confirmCancelUpload}
        isLoading={false}
      />
    </div>
  );
}
