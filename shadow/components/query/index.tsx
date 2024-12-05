"use client";

import { QuestionHeaderComponent } from "./title-bar";
import { SQLWorkbench } from "@/components/query/workspace";
import { useVisualizationOpen } from "@/hook/use-visualization";
import { cn } from "@/lib/utils";
import { ViewModeSelector } from "./display/view-mode-selector";
import { useEffect } from "react";

export default function Query() {
  const { isOpen } = useVisualizationOpen();

 
  return (
    <div className='h-full flex flex-col overflow-hidden'>
      {/* Header */}
      <header className='h-16 shrink-0 border-b'>
        <QuestionHeaderComponent />
      </header>

      {/* Main Content */}
      <main className='flex-1 flex overflow-hidden min-h-0'>
        {/* SQL Workbench Area */}
        <div
          className={cn(
            "transition-all duration-200 overflow-auto" /* 添加 overflow-auto */,
            isOpen ? "w-4/5" : "w-full"
          )}
        >
          <SQLWorkbench />
        </div>

        {/* View Mode Selector */}
        {isOpen && (
          <aside className='w-1/5 border-l overflow-auto'>
            <ViewModeSelector />
          </aside>
        )}
      </main>
    </div>
  );
}
