"use client";

import { QuestionHeaderComponent } from "./title-bar";
import { SQLWorkbench } from "@/components/query/workspace";
import { useVisualization } from "@/hook/use-visualization";
import { cn } from "@/lib/utils";
import { ViewModeSelector } from "./display/view-mode-selector";

export default function Query() {
  const { isOpen } = useVisualization();

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      <div className='h-16'>
        <QuestionHeaderComponent />
      </div>
      <div className='flex-1 min-h-0 flex'>
        <div
          className={cn("flex-1 transition-all", isOpen ? "w-[80%]" : "w-full")}
        >
          <SQLWorkbench />
        </div>

        {isOpen && (
          <div className='w-[20%] border-l'>
            <ViewModeSelector />
          </div>
        )}
      </div>
    </div>
  );
}
