import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToggleButtonProps {
  onToggle: () => void;
  isExpanded?: boolean; // 可选属性，用于控制图标状态
}

export function ToggleButton({
  onToggle,
  isExpanded = false,
}: ToggleButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isExpanded ? "收起编辑器" : "展开编辑器"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
