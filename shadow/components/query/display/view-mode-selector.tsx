"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useVisualization } from "@/hook/use-visualization";
import { ViewTooltip } from "./view-tooltip";
import { VIEW_MODES } from "./types";
import { FileTextIcon } from "lucide-react";

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
      <ViewModeButtonWithParams />
    </div>
  );
}

function ViewModeButtonWithParams() {
  const { viewMode, setViewMode, aiParams, setAiParams } = useVisualization();
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!isExpanded) {
    return (
      <Button
        variant={viewMode === "llm" ? "secondary" : "ghost"}
        className='flex flex-col items-center justify-center h-24 p-2 gap-2'
        onClick={() => setIsExpanded(true)}
      >
        <div
          className={cn(
            "rounded-full p-2",
            viewMode === "llm" ? "bg-primary/10" : "bg-muted"
          )}
        >
          <FileTextIcon className='h-4 w-4' />
        </div>
        <span className='text-xs font-medium'>AI 分析</span>
      </Button>
    );
  }

  return (
    <div className='col-span-4 space-y-4 p-4 border rounded-lg'>
      <div className='flex justify-between items-center'>
        <h3 className='font-medium'>AI 分析参数</h3>
        <Button size='sm' variant='ghost' onClick={() => setIsExpanded(false)}>
          收起
        </Button>
      </div>

      <div className='flex gap-2'>
        <Button
          variant={aiParams.type === "imitate" ? "secondary" : "ghost"}
          onClick={() => setAiParams({ ...aiParams, type: "imitate" })}
        >
          仿写
        </Button>
        <Button
          variant={aiParams.type === "generate" ? "secondary" : "ghost"}
          onClick={() => setAiParams({ ...aiParams, type: "generate" })}
        >
          自定义
        </Button>
      </div>

      <textarea
        className='w-full h-32 p-2 border rounded-md'
        placeholder={
          aiParams.type === "imitate"
            ? "请输入要仿照的历史文本..."
            : "请输入生成指令..."
        }
        value={aiParams.input}
        onChange={(e) => setAiParams({ ...aiParams, input: e.target.value })}
      />

      <Button
        className='w-full'
        onClick={() => {
          setViewMode("llm");
          setIsExpanded(false);
        }}
      >
        开始分析
      </Button>
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
            "rounded-full p-2",
            isSelected ? "bg-primary/10" : "bg-muted"
          )}
        >
          <Icon className='h-4 w-4' />
        </div>
        <span className='text-xs font-medium'>{mode.name}</span>
      </Button>
    </ViewTooltip>
  );
}
