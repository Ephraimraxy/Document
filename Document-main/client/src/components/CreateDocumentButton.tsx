import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateDocumentButtonProps {
  onClick: () => void;
}

export default function CreateDocumentButton({ onClick }: CreateDocumentButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="px-8 py-6 text-base font-medium shadow-md hover:shadow-lg transition-shadow"
      data-testid="button-create-document"
    >
      <FileText className="w-5 h-5 mr-2" />
      Create Document
    </Button>
  );
}
