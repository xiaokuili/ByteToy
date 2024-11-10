import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VIEW_MODES } from "./types";

interface ViewTooltipProps {
  children: React.ReactNode;
  viewId: string;
}
export function ViewTooltip({ children, viewId }: ViewTooltipProps) {
  const tooltipContent = VIEW_MODES.find(mode => mode.id === viewId)?.tooltip;
  if (!tooltipContent) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="w-80 bg-white text-black border border-gray-200 shadow-md">
          <div className="space-y-2 p-3">
            {tooltipContent.title && (
              <h4 className="font-semibold text-black">
                {tooltipContent.title}
              </h4>
            )}

            <p className="text-sm text-gray-600">
              {tooltipContent.description}
            </p>

            {tooltipContent.examples && tooltipContent.examples.length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Examples:{" "}
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {tooltipContent.examples.map((example: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
