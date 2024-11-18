"use client";

import { Visualization } from "@/types/base";
import { useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useState } from "react";
import { DashboardVisualization } from "./dashboard-view";
import { executeQuery } from "@/lib/datasource-action";
import { getFinalSql } from "@/utils/variable-utils";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { CopyIcon } from "@radix-ui/react-icons";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DashboardConfig } from "./types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { DashboardSection } from "@/types/base";
import { TrashIcon } from "@radix-ui/react-icons";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardCanvasProps {
  dashboardSections: DashboardSection[];
  deleteSection: (sectionId: string) => void;
}

export function LoadingView() {
  return <div>Loading...</div>;
}

export function QueryErrorView({ error }: { error: string }) {
  return <div>{error}</div>;
}

export function DashboardCanvas({
  dashboardSections,
  deleteSection,
}: DashboardCanvasProps) {
  const [queryResults, setQueryResults] = useState<Record<string, QueryResult>>(
    {}
  );
  const [queryErrors, setQueryErrors] = useState<Record<string, string>>({});
  const [config, setConfig] = useState<DashboardConfig>({});

  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount
    const executeQueries = async () => {
      const results: Record<string, QueryResult> = {};
      const errors: Record<string, string> = {};

      for (const section of dashboardSections) {
        // Stop execution if component is unmounted
        if (!isMounted) return;

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
            results[section.id] = result.data;
          } else {
            errors[section.id] = result.error || "Unknown error";
          }
        } catch (error) {
          console.error(
            `Error executing query for block ${section.id}:`,
            error
          );
          errors[section.id] = "Failed to execute query";
        }
      }
      // 确保组件仍然挂载时才更新状态
      if (isMounted) {
        setQueryResults(results);
        setQueryErrors(errors);
      }
    };

    executeQueries();

    // 清理函数
    return () => {
      isMounted = false;
    };
  }, [dashboardSections]);

  const layouts = {
    lg: dashboardSections.map((section, index) => ({
      i: section.id,
      x: (index * 4) % 12,
      y: Math.floor(index / 3) * 4,
      w: 4,
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
        rowHeight={100}
        draggableCancel='.no-drag'
      >
        {dashboardSections.map((section) => (
          <div key={section.id} className='bg-card border rounded-lg p-4'>
            <DashboardGridItem
              section={section}
              queryErrors={queryErrors}
              queryResults={queryResults}
              deleteSection={deleteSection}
              config={config}
              setConfig={setConfig}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}

export function DashboardGridItem({
  section,
  queryErrors,
  queryResults,
  deleteSection,
  config,
  setConfig,
}: {
  section: DashboardSection;
  queryErrors: Record<string, string>;
  queryResults: Record<string, QueryResult>;
  deleteSection: (sectionId: string) => void;
  config: DashboardConfig;
  setConfig: (config: DashboardConfig) => void;
}) {
  const dashbaordConfig = {
    llmConfig: {
      prompt: "帮我解释这些数据",
    },
  };
  return (
    <div className='h-full'>
      <div className='flex items-center justify-between mb-2 no-drag'>
        <h3 className='text-lg font-semibold'>{section.name}</h3>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => deleteSection(section.id)}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <div className='h-[calc(100%-2rem)]'>
        {queryErrors[section.id] ? (
          <QueryErrorView error={queryErrors[section.id]} />
        ) : !queryResults[section.id] ? (
          <LoadingView />
        ) : (
          <DashboardVisualization
            dashboardViewId='llm'
            queryResult={queryResults[section.id]}
            config={dashbaordConfig}
          />
        )}
      </div>
    </div>
  );
}
