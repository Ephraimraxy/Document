import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorHeaderProps {
  documentTitle: string;
  onClose: () => void;
}

export default function EditorHeader({ documentTitle, onClose }: EditorHeaderProps) {
  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-foreground" data-testid="text-document-title">
          {documentTitle}
        </h1>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        data-testid="button-close-editor"
      >
        <X className="w-5 h-5" />
      </Button>
    </header>
  );
}
