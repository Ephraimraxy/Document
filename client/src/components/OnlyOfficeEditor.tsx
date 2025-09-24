import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Loader2, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Document } from "@shared/schema";

interface OnlyOfficeEditorProps {
  document: Document;
  onClose: () => void;
}

declare global {
  interface Window {
    DocsAPI: {
      DocEditor: new (containerId: string, config: any) => any;
    };
  }
}

export default function OnlyOfficeEditor({ document, onClose }: OnlyOfficeEditorProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const docEditorRef = useRef<any>(null);

  useEffect(() => {
    const loadOnlyOfficeEditor = async () => {
      try {
        // Load OnlyOffice API script if not already loaded
        if (!window.DocsAPI) {
          const script = window.document.createElement("script");
          script.src = `${import.meta.env.VITE_ONLYOFFICE_URL || "http://onlyoffice.mycompany.local"}/web-apps/apps/api/documents/api.js`;
          script.onload = () => initializeEditor();
          script.onerror = () => setError("Failed to load OnlyOffice API");
          document.head.appendChild(script);
        } else {
          initializeEditor();
        }
      } catch (err: any) {
        setError(err.message || "Failed to initialize editor");
        setLoading(false);
      }
    };

    const initializeEditor = async () => {
      try {
        // Get OnlyOffice config from backend
        const response = await apiRequest("POST", `/api/onlyoffice/config`, {
          documentId: document.id,
        });
        const config = await response.json();

        if (editorRef.current && window.DocsAPI) {
          docEditorRef.current = new window.DocsAPI.DocEditor("onlyoffice-editor", config);
          setLoading(false);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load document config");
        setLoading(false);
      }
    };

    loadOnlyOfficeEditor();

    return () => {
      if (docEditorRef.current) {
        try {
          docEditorRef.current.destroyEditor();
        } catch (e) {
          console.warn("Error destroying OnlyOffice editor:", e);
        }
      }
    };
  }, [document.id]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg" data-testid="text-editing-document">
                  {document.title}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">Editing with OnlyOffice</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-editor"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 p-4">
          {loading && (
            <div className="h-full bg-muted rounded-lg border flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-foreground font-medium">Loading OnlyOffice Editor...</p>
                <p className="text-muted-foreground text-sm mt-1">Please wait while the document loads</p>
              </div>
            </div>
          )}

          {error && (
            <div className="h-full bg-muted rounded-lg border flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-foreground font-medium">Failed to Load Editor</p>
                <p className="text-muted-foreground text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <div
            ref={editorRef}
            id="onlyoffice-editor"
            className="w-full h-full rounded-lg border"
            style={{ display: loading ? "none" : "block" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
