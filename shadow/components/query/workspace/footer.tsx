"use client";

import { useState } from "react";
import {
  Clock,
  Grid,
  BarChart2,
  Download,
  BarChart3,
  Table,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVisualization } from "@/hook/use-visualization";

interface QueryResultHeaderProps {
  rowCount?: number;
  executionTime?: number;
}
interface ViewToggleProps {
  view: "table" | "chart";
  onViewChange: (view: "table" | "chart") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className='flex bg-muted rounded-md p-1'>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => onViewChange("table")}
        className={cn(
          "px-3",
          "transition-colors duration-200",
          "hover:bg-transparent", // 移除默认的悬停效果
          view === "table" && "bg-background shadow-sm"
        )}
      >
        <Table
          className={cn(
            "h-4 w-4",
            view === "table" ? "text-primary" : "text-muted-foreground"
          )}
        />
      </Button>

      <Button
        variant='ghost'
        size='sm'
        onClick={() => onViewChange("chart")}
        className={cn(
          "px-3",
          "transition-colors duration-200",
          "hover:bg-transparent", // 移除默认的悬停效果
          view === "chart" && "bg-background shadow-sm"
        )}
      >
        <BarChart3
          className={cn(
            "h-4 w-4",
            view === "chart" ? "text-primary" : "text-muted-foreground"
          )}
        />
      </Button>
    </div>
  );
}

export function QueryFooterHeader({
  rowCount = 0,
  executionTime = 0,
}: QueryResultHeaderProps) {
  const [view, setView] = useState<"table" | "chart">("table");
  const { isOpen, setIsOpen, viewMode, setViewMode, chartType, setChartType } =
    useVisualization();
  return (
    <div
      className={cn(
        "grid grid-cols-3", // 改为三等分网格
        "px-4 py-2",
        "bg-background/50",
        "border-t",
        "h-full"
      )}
    >
      {/* 左侧 */}
      <div className='flex items-center'>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant='ghost'
          size='sm'
          className='text-sm font-medium hover:bg-primary/10 hover:text-primary flex items-center gap-2 transition-colors'
        >
          <div className='p-1 rounded-md bg-primary/10'>
            <BarChart2 className='h-4 w-4 text-primary' />
          </div>
          Visualization
        </Button>
      </div>
      {/* 中间 */}
      {rowCount ? (
        <div className='flex items-center justify-center'>
          <ViewToggle view={viewMode} onViewChange={setViewMode} />
        </div>
      ) : null}
      {/* 右侧 */}
      <div className='flex items-center justify-end'>
        {/* 行数统计 */}
        {rowCount ? (
          <div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
            <Grid className='h-4 w-4' />
            <span>Showing {rowCount} rows</span>
          </div>
        ) : null}

        {/* 执行时间 */}
        {executionTime ? (
          <div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
            <Clock className='h-4 w-4' />
            <span>{executionTime}ms</span>
          </div>
        ) : null}

        <Button variant='ghost' size='icon' className='h-8 w-8'>
          <Download className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
