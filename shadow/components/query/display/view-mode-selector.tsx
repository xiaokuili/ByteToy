"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useVisualization } from "@/hook/use-visualization";
import { ViewTooltip } from "./view-tooltip";
import { VIEW_MODES } from "./types";

export function ViewModeSelector() {
  const { viewMode, setViewMode } = useVisualization();
  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base font-semibold'>数据可视化</CardTitle>
      </CardHeader>
      <CardContent className='p-0 flex-1 min-h-0'>
        <ScrollArea className='h-full px-4'>
          <ChartVisualization viewMode={viewMode} setViewMode={setViewMode} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ChartVisualization({
  viewMode,
  setViewMode,
}: {
  viewMode: string;
  setViewMode: (mode: string) => void;
}) {
  return (
    <div className='grid grid-cols-3 gap-2 py-4'>
      {VIEW_MODES.map((mode) => (
        <ViewModeButton
          key={mode.id}
          mode={mode}
          isSelected={viewMode === mode.id}
          onClick={() => {
            setViewMode(mode.id);
          }}
        />
      ))}
    </div>
  );
}

// 视图模式按钮组件
function ViewModeButton({
  mode,
  isSelected,
  onClick,
}: {
  mode: { id: string; name: string; icon: React.ComponentType };
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = mode.icon;

  return (
    <ViewTooltip viewId={mode.id}>
      <Button
        variant={isSelected ? "secondary" : "ghost"}
        className='flex flex-col items-center justify-center h-24 p-2 gap-2'
        onClick={onClick}
      >
        <div
          className={cn(
            "rounded-full p-2 h-4 w-4",
            isSelected ? "bg-primary/10" : "bg-muted"
          )}
        >
          <Icon  />
        </div>
        <span className='text-xs font-medium'>{mode.name}</span>
      </Button>
    </ViewTooltip>
  );
}
