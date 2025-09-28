import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  showPasswordToggle?: boolean;
  required?: boolean;
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(({
  label,
  error,
  success,
  hint,
  showPasswordToggle = false,
  required = false,
  type,
  className,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={props.id} 
          className={cn(
            "text-sm font-medium",
            hasError && "text-destructive",
            hasSuccess && "text-green-600"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          ref={ref}
          type={inputType}
          className={cn(
            "transition-all duration-200",
            hasError && "border-destructive focus-visible:ring-destructive",
            hasSuccess && "border-green-500 focus-visible:ring-green-500",
            isFocused && !hasError && !hasSuccess && "ring-2 ring-primary/20",
            showPasswordToggle && "pr-10",
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
        
        {(hasError || hasSuccess) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasError ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {success && !error && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {success}
        </p>
      )}
      
      {hint && !error && !success && (
        <p className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
});