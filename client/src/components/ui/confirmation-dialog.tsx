import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning" | "success";
  onConfirm: () => void;
  isLoading?: boolean;
}

const variantConfig = {
  default: {
    icon: Info,
    iconClass: "text-blue-500",
    confirmClass: "bg-blue-600 hover:bg-blue-700",
  },
  destructive: {
    icon: XCircle,
    iconClass: "text-red-500",
    confirmClass: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-yellow-500",
    confirmClass: "bg-yellow-600 hover:bg-yellow-700",
  },
  success: {
    icon: CheckCircle,
    iconClass: "text-green-500",
    confirmClass: "bg-green-600 hover:bg-green-700",
  },
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  isLoading = false,
}: ConfirmationDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full bg-background border flex items-center justify-center`}>
              <Icon className={`h-4 w-4 ${config.iconClass}`} />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="mt-3">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`${config.confirmClass} text-white`}
            data-testid="button-confirm-action"
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}