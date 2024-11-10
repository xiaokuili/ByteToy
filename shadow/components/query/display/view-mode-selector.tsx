"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useVisualization } from "@/hook/use-visualization";
import { ViewTooltip } from "./view-tooltip";
import { VIEW_MODES } from "./types";
export function ViewModeSelector() {
  const { viewMode, setViewMode } = useVisualization();
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">数据可视化</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="basic" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">图形展示</TabsTrigger>
            <TabsTrigger value="ai">AI生成</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-full px-4">
            <TabsContent value="basic" className="mt-0 border-0 p-0">
              <ChartVisualization 
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            </TabsContent>
            <TabsContent value="ai" className="mt-0 border-0 p-0">
              <AIGeneration />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ChartVisualization({
  viewMode,
  setViewMode
}: {
  viewMode: string;
  setViewMode: (mode: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 py-4">
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

function AIGeneration() {
  const [analysisType, setAnalysisType] = React.useState<'imitate' | 'generate'>('imitate');
  const [input, setInput] = React.useState('');

  return (
    <div className="py-4 space-y-4">
      <div className="flex gap-2">
        <Button
          variant={analysisType === 'imitate' ? 'secondary' : 'ghost'}
          onClick={() => setAnalysisType('imitate')}
        >
          仿写
        </Button>
        <Button
          variant={analysisType === 'generate' ? 'secondary' : 'ghost'} 
          onClick={() => setAnalysisType('generate')}
        >
          自定义
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {analysisType === 'imitate' ? '历史文本' : '生成指令'}
        </label>
        <textarea
          className="w-full h-32 p-2 border rounded-md"
          placeholder={
            analysisType === 'imitate' 
              ? '请输入要仿照的历史文本...'
              : '请输入生成指令...'
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <Button className="w-full">
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
  mode: { id: string; name: string; icon: any };
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = mode.icon;

  return (
    <ViewTooltip viewId={mode.id}>
      <Button
        variant={isSelected ? "secondary" : "ghost"}
        className="flex flex-col items-center justify-center h-24 p-2 gap-2"
        onClick={onClick}
      >
        <div
          className={cn(
            "rounded-full p-2",
            isSelected ? "bg-primary/10" : "bg-muted",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-medium">{mode.name}</span>
      </Button>
    </ViewTooltip>
  );
}
