"use client";

import { useEffect, useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useState } from "react";
import { DashboardFactory } from "./dashboard-factory";
import { executeQuery } from "@/lib/datasource-action";
import { getFinalSql } from "@/utils/variable-utils";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Button } from "../ui/button";

import { DashboardSection } from "@/types/base";
import { TrashIcon } from "@radix-ui/react-icons";
import { useDashboardActive } from "@/hook/use-dashboard";
import { Settings } from "lucide-react";
import { QueryResult } from "../query/display/types";

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

  const layouts = {
    lg: dashboardSections.map((section, index) => ({
      i: section.id,
      x: (index * 6) % 12, // Changed from 4 to 6 to make blocks wider
      y: Math.floor(index / 2) * 6, // Changed from 3 to 2 and height from 4 to 6
      w: 3, // Changed from 4 to 6 for wider blocks
      h: 4, // Changed from 4 to 6 for taller blocks
    })),
  };
  return (
    <div className='flex-1 p-4'>
      <ResponsiveGridLayout
        className='layout'
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={80} // Reduced from 100 to 80 to compensate for taller blocks
        draggableCancel='.no-drag'
      >
        {dashboardSections.map((section) => (
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
              removeSection={removeSection}
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
  const [queryResult, setQueryResult] = useState<QueryResult>({});
  const [queryError, setQueryError] = useState<string>("");

  // 使用 useMemo 缓存查询执行函数
  const executeQueries = useMemo(
    () => async () => {
      if (!section.visualization?.id) {
        setQueryError("请选择合适的数据和内容生成进行展示");
        return;
      }

      try {
        const finalSql = getFinalSql(
          section.visualization.sqlContent,
          section.visualization.sqlVariables
        );
        const result = await executeQuery(
          section.visualization.datasourceId,
          finalSql
        );

        if (result.success) {
          setQueryResult(result.data);
          setQueryError("");
        } else {
          setQueryError(result.error || "Unknown error");
          setQueryResult({});
        }
      } catch (error) {
        console.error(`Error executing query for block ${section.id}:`, error);
        setQueryError("Failed to execute query");
      }
    },
    [section.visualization, section.id] // 只依赖这些必要的属性
  );

  useEffect(() => {
    executeQueries();
  }, [executeQueries]); // 只在 executeQueries 改变时执行

  console.log(
    "section",
    section.type,
    section.visualization?.viewMode,
    queryResult
  );
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
        {queryError ? (
          <QueryErrorView error={queryError} />
        ) : (
          <DashboardFactory
            dashboardViewId={
              section.type !== "OTHER"
                ? section.type.toLowerCase()
                : section.visualization.viewMode
            }
            queryResult={queryResult}
            config={section}
          />
        )}
      </div>
    </div>
  );
}
