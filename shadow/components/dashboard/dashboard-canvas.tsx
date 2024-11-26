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
import {
  createDashboardSection,
  useDashboardOperations,
  useDashboardSection,
} from "@/hook/use-dashboard";
import { useState, useEffect } from "react";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardCanvasProps {
  dashboardSections: DashboardSection[];
  removeSection: (sectionId: string) => void;
}

export function LoadingView() {
  return <div>Loading...</div>;
}

export function QueryErrorView({ error }: { error: string }) {
  return <div>{error}</div>;
}
export function DashboardCanvas({
  dashboardSections,
  removeSection,
}: DashboardCanvasProps) {
  const { activeId, setActiveId } = useDashboardActive();
  const { sections, add, remove, update } = useDashboardOperations();

  const handleUpdateSection = (id: string) => {
    update(id, {
      sqlContent: "SELECT * FROM users WHERE active = true",
    });
  };

  const layouts = {
    lg: sections.map((section, index) => ({
      i: section.id,
      x: (index * 6) % 12,
      y: Math.floor(index / 2) * 6,
      w: 3,
      h: 4,
    })),
  };

  return (
    <div className='flex-1 p-4'>
      <ResponsiveGridLayout
        className='layout'
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={80}
        draggableCancel='.no-drag'
      >
        {sections.map((section) => (
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
              removeSection={remove}
              setActiveId={setActiveId}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}

export function DashboardGridItem({
  section,
  removeSection,
  setActiveId,
}: {
  section: DashboardSection;
  removeSection: (sectionId: string) => void;
  setActiveId: (id: string | null) => void;
}) {
  const [data, setData] = useState<unknown>(null);
  const { ViewComponent, processedData } = useDashboardSection(section);

  useEffect(() => {
    const loadData = async () => {
      const result = await processedData;
      console.log("result", result);
      setData(result);
    };
    loadData();
  }, [processedData]);
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
      <div className='h-[calc(100%-2rem)]'>
        {data ? <ViewComponent.Component data={data} /> : <Loading />}
      </div>
    </div>
  );
}
function Loading() {
  return <div>Loading...</div>;
}
