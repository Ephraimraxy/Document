import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import DocumentTypeSelector from "@/components/DocumentTypeSelector";
import OnlyOfficeEditor from "@/components/OnlyOfficeEditor";
import EditorHeader from "@/components/EditorHeader";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [editorConfig, setEditorConfig] = useState<any>(null);
  const { toast } = useToast();

  const createDocMutation = useMutation({
    mutationFn: async (documentType: "docx" | "xlsx" | "pptx") => {
      const response = await apiRequest("POST", "/api/doc-config", { documentType });
      return await response.json();
    },
    onSuccess: (data) => {
      setEditorConfig(data);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create document. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleCreateDocument = () => {
    setShowTypeSelector(true);
  };

  const handleSelectDocumentType = (type: "docx" | "xlsx" | "pptx") => {
    createDocMutation.mutate(type);
  };

  const handleCloseEditor = () => {
    setEditorConfig(null);
    setShowTypeSelector(false);
  };

  if (editorConfig) {
    return (
      <div className="h-screen flex flex-col">
        <EditorHeader 
          documentTitle={editorConfig.docConfig.document.title} 
          onClose={handleCloseEditor} 
        />
        <div className="flex-1">
          <OnlyOfficeEditor 
            config={editorConfig.docConfig}
            serverUrl={editorConfig.serverUrl}
            token={editorConfig.token}
          />
        </div>
      </div>
    );
  }

  if (showTypeSelector) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-3xl space-y-6">
          <DocumentTypeSelector onSelect={handleSelectDocumentType} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">
            Document Editor
          </h1>
          <p className="text-muted-foreground">
            Create and edit documents with OnlyOffice
          </p>
        </div>
        <button
          onClick={handleCreateDocument}
          className="px-8 py-6 text-base font-medium bg-primary text-primary-foreground rounded-lg shadow-md hover:shadow-lg transition-shadow hover-elevate active-elevate-2"
          data-testid="button-create-document"
        >
          Create Document
        </button>
      </div>
    </div>
  );
}
