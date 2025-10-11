import { FileText, Sheet, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentTypeSelectorProps {
  onSelect: (type: "docx" | "xlsx" | "pptx") => void;
}

export default function DocumentTypeSelector({ onSelect }: DocumentTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Choose document type</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="h-32 flex-col gap-3 hover-elevate"
          onClick={() => onSelect("docx")}
          data-testid="button-select-word"
        >
          <FileText className="w-8 h-8 text-primary" />
          <div className="text-center">
            <div className="font-medium">Document</div>
            <div className="text-sm text-muted-foreground">Word</div>
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-32 flex-col gap-3 hover-elevate"
          onClick={() => onSelect("xlsx")}
          data-testid="button-select-excel"
        >
          <Sheet className="w-8 h-8 text-primary" />
          <div className="text-center">
            <div className="font-medium">Spreadsheet</div>
            <div className="text-sm text-muted-foreground">Excel</div>
          </div>
        </Button>
        <Button
          variant="outline"
          className="h-32 flex-col gap-3 hover-elevate"
          onClick={() => onSelect("pptx")}
          data-testid="button-select-powerpoint"
        >
          <Presentation className="w-8 h-8 text-primary" />
          <div className="text-center">
            <div className="font-medium">Presentation</div>
            <div className="text-sm text-muted-foreground">PowerPoint</div>
          </div>
        </Button>
      </div>
    </div>
  );
}
