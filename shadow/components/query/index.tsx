"use client";

import { QuestionHeaderComponent } from "./query-header";
import { QueryContentComponent } from "@/components/query/query-content";
import { useVisualization } from "@/hook/use-visualization";
import { cn } from "@/lib/utils";
import { VisualizationPanel } from "./visualization-panel";
export default function Query() {
  const { isOpen } = useVisualization();

  return (
    <div className='flex flex-col h-full overflow-hidden'>
      <div className='h-16'>
        <QuestionHeaderComponent />
      </div>
      <div className='flex-1 min-h-0 flex'>
        <div
          className={cn("flex-1 transition-all", isOpen ? "w-[60%]" : "w-full")}
        >
          <QueryContentComponent />
        </div>

        {isOpen && (
          <div className='w-[40%] border-l'>
            <VisualizationPanel />
          </div>
        )}
      </div>
    </div>
  );
}
