import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, X, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface OnlyOfficeConfig {
  documentType: string;
  document: {
    fileType: string;
    key: string;
    title: string;
    url: string;
  };
  editorConfig: {
    callbackUrl: string;
    user: {
      id: string;
      name: string;
    };
  };
  token: string;
}

export default function DocumentEditor() {
  const { id } = useParams<{ id: string }>();
  const [config, setConfig] = useState<OnlyOfficeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;

    loadOnlyOfficeConfig();
  }, [id]);

  const loadOnlyOfficeConfig = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("GET", `/api/onlyoffice/config/${id}`);
      const configData = await response.json();
      setConfig(configData);
      
      // Initialize OnlyOffice editor
      if (window.DocsAPI) {
        initializeEditor(configData);
      } else {
        // Load OnlyOffice API script
        const script = document.createElement("script");
        script.src = `${import.meta.env.VITE_ONLYOFFICE_URL || "http://onlyoffice.mycompany.local"}/web-apps/apps/api/documents/api.js`;
        script.onload = () => initializeEditor(configData);
        script.onerror = () => {
          setError("Failed to load OnlyOffice API");
          setLoading(false);
        };
        document.head.appendChild(script);
      }
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      toast({
        title: "Failed to load document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const initializeEditor = (config: OnlyOfficeConfig) => {
    try {
      new window.DocsAPI.DocEditor("onlyoffice-editor", {
        ...config,
        width: "100%",
        height: "100%",
        events: {
          onDocumentStateChange: (event: any) => {
            console.log("Document state changed:", event);
          },
          onError: (event: any) => {
            console.error("OnlyOffice error:", event);
            toast({
              title: "Editor error",
              description: "An error occurred in the document editor",
              variant: "destructive",
            });
          },
        },
      });
      setLoading(false);
    } catch (error: any) {
      setError("Failed to initialize editor");
      setLoading(false);
      toast({
        title: "Editor initialization failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    window.history.back();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <X className="mr-2 h-5 w-5" />
              Error Loading Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" data-testid="document-editor-modal">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-card rounded-lg border border-border w-full max-w-7xl h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground" data-testid="document-title">
                  {config?.document.title || "Loading document..."}
                </h3>
                <p className="text-sm text-muted-foreground">Editing with OnlyOffice</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              data-testid="button-close-editor"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* OnlyOffice Editor Container */}
          <div className="flex-1 p-4">
            <div 
              id="onlyoffice-editor" 
              className="w-full h-full bg-muted rounded-lg border border-border"
              data-testid="onlyoffice-editor-container"
            >
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-foreground font-medium">Loading OnlyOffice Editor...</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Please wait while the document loads
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    DocsAPI: any;
  }
}
