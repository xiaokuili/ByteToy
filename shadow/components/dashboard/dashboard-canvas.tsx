"use client";

import { Responsive, WidthProvider } from "react-grid-layout";
import { DashboardFactory } from "./dashboard-factory";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Button } from "../ui/button";
import { DashboardSection } from "@/types/base";
import { TrashIcon } from "@radix-ui/react-icons";
import { useDashboardActive } from "@/hook/use-dashboard";
import { Settings } from "lucide-react";
import {LoadingView, EmptyDataView} from "@/components/query/display/view-factory"
import {
  createDashboardSection,
  useDashboardOperations,
  useDashboardSection,
} from "@/hook/use-dashboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useCallback } from "react";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardCanvasProps {
  dashboardSections: DashboardSection[];
  removeSection: (sectionId: string) => void;
}


export function QueryErrorView({ error }: { error: string }) {
  return <div>{error}</div>;
}
export function DashboardCanvas() {
  const { activeId, setActiveId } = useDashboardActive();
  const { sections, add, remove, update } = useDashboardOperations();


  const { layouts, updateLayouts } = useDashboardOperations();

  const onLayoutChange = (newLayout: Layout[]) => {
    updateLayouts(newLayout);
  };

  
  return (
    <div className='flex-1 p-4'>
      <ResponsiveGridLayout
        className='layout'
        layouts={{ lg: layouts }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={80}
        autoSize={true}      // 添加这个属性
        draggableCancel='.no-drag'
        onLayoutChange={onLayoutChange}
        compactType={null} // 防止自动压缩
        preventCollision={true} // 防止元素重叠
        // 设置默认尺寸
        containerPadding={[0, 0]}
        minHeight={1000}
      >
        {sections?.map((section) => (
          <div
            key={section.id}
            className={`bg-card rounded-lg p-4 transition-all duration-200 ${
              activeId === section.id
                ? "ring-1 ring-blue-200 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
                : ""
            }`}
          >
            <DashboardGridItem
              section={section}
              key={section.viewMode || section.id}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
export function DashboardGridItem({
  section,
}: {
  section: DashboardSection;
}) {
  const { ViewComponent, processedData, status } = useDashboardSection(section);
  const { remove: removeSection } = useDashboardOperations();
  const { setActiveId } = useDashboardActive();
  
  return (
    <div className='h-full'>
      <div className='flex items-center justify-between mb-2 no-drag'>
        <h3 className='text-lg font-semibold'>{section.name}</h3>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={(e) => {
              e.stopPropagation();
              setActiveId(section.id);
            }}
          >
            <Settings className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            onClick={(e) => {
              e.stopPropagation();
              removeSection(section.id);
              setActiveId(null);
            }}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <ScrollArea className='h-[calc(100%-2rem)]'>
        {status === 'empty' && <EmptyDataView />}
        {status === 'executing' && <LoadingView />}
        {status === 'complete' && ViewComponent && processedData && (
          <ViewComponent.Component data={processedData} />
        )}
      </ScrollArea>
    </div>
  );
}

