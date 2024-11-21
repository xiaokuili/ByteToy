"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useQueryAndViewState } from "@/hook/use-visualization";
import { Visualization } from "@/components/query/display/visualization";

export function QueryViewComponent() {
  const { sqlContent, variables, databaseId, viewMode } =
    useQueryAndViewState();

  return (
    <ScrollCard>
      <Visualization
        viewId={viewMode}
        sqlContent={sqlContent}
        sqlVariables={variables}
        databaseId={databaseId}
      />
    </ScrollCard>
  );
}

export function ScrollCard({
  children,
  className,
  contentClassName,
  minWidth = "min-w-full",
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  minWidth?: string;
}) {
  return (
    <ScrollArea className='flex-1 h-full'>
      <div
        className={cn(
          "min-h-0 w-full h-full border rounded-lg bg-white",
          minWidth,
          className,
          contentClassName
        )}
      >
        {children}
      </div>
      <ScrollBar orientation='horizontal' />
      <ScrollBar orientation='vertical' />
    </ScrollArea>
  );
}
