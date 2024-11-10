import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueryErrorViewProps {
  error: string;
  className?: string;
}

export function VisualizationErrorView({
  error,
  className,
}: QueryErrorViewProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 rounded-md",
        className,
      )}
    >
      <AlertCircle className="h-4 w-4" />
      <span>{error}</span>
    </div>
  );
}
