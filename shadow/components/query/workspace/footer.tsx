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

export function QueryFooterHeader({
  rowCount = 0,
  executionTime = 0,
}: QueryResultHeaderProps) {
  const [view, setView] = useState<"table" | "chart">("table");
  const { isOpen, setIsOpen, viewMode, setViewMode } = useVisualization();
  return (
    <div
      className={cn(
        "grid grid-cols-2", // 改为三等分网格
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
