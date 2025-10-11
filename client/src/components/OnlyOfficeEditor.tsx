import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface OnlyOfficeEditorProps {
  config: any;
  serverUrl: string;
  token: string;
}

declare global {
  interface Window {
    DocsAPI: any;
  }
}

export default function OnlyOfficeEditor({ config, serverUrl, token }: OnlyOfficeEditorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current || !window.DocsAPI) return;

    const editorConfig = {
      ...config,
      token: token,
      events: {
        onDocumentReady: () => {
          console.log("Document is ready");
          setIsLoading(false);
        },
        onError: (event: any) => {
          console.error("OnlyOffice Error:", event);
          setIsLoading(false);
        },
        onWarning: (event: any) => {
          console.warn("OnlyOffice Warning:", event);
        },
        onInfo: (event: any) => {
          console.log("OnlyOffice Info:", event);
        }
      }
    };

    console.log("Initializing OnlyOffice Editor with config:", editorConfig);
    const docEditor = new window.DocsAPI.DocEditor(editorRef.current.id, editorConfig);

    return () => {
      docEditor?.destroyEditor();
    };
  }, [config, token]);

  return (
    <div className="relative w-full h-full" data-testid="container-editor">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      )}
      <div
        id="onlyoffice-editor"
        ref={editorRef}
        className="w-full h-full"
        data-testid="div-onlyoffice-editor"
      />
    </div>
  );
}
