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

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  visualizations: Visualization[];
  setSelectedVisualizations: (visualizations: Visualization[]) => void;
}

export function LoadingView() {
  return <div>Loading...</div>;
}

export function QueryErrorView({ error }: { error: string }) {
  return <div>{error}</div>;
}

export function DashboardGrid({
  visualizations,
  setSelectedVisualizations,
}: DashboardGridProps) {
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

      for (const visualization of visualizations) {
        // Stop execution if component is unmounted
        if (!isMounted) return;

        try {
          const finalSql = getFinalSql(
            visualization.sqlContent,
            visualization.sqlVariables
          );
          const result = await executeQuery(
            visualization.datasourceId,
            finalSql
          );

          if (result.success) {
            results[visualization.id] = result.data;
          } else {
            errors[visualization.id] = result.error || "Unknown error";
          }
        } catch (error) {
          console.error(
            `Error executing query for block ${visualization.id}:`,
            error
          );
          errors[visualization.id] = "Failed to execute query";
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
  }, [visualizations]);

  const onCopyVisualization = (visualization: Visualization) => {
    const newVisualization = {
      ...visualization,
      id: `${visualization.id}-copy-${Date.now()}`, // Generate unique ID for copy
      name: `${visualization.name} (Copy)`, // Add (Copy) to name
    };
    setSelectedVisualizations([...visualizations, newVisualization]); // Add copy to end of blocks array
  };

  const layouts = {
    lg: visualizations.map((visualization, index) => ({
      i: visualization.id,
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
        {visualizations.map((visualization) => (
          <div key={visualization.id} className='bg-card border rounded-lg p-4'>
            <DashboardGridItem
              visualization={visualization}
              queryErrors={queryErrors}
              queryResults={queryResults}
              onCopyVisualization={onCopyVisualization}
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
  visualization,
  queryErrors,
  queryResults,
  onCopyVisualization,
  config,
  setConfig,
}: {
  visualization: Visualization;
  queryErrors: Record<string, string>;
  queryResults: Record<string, QueryResult>;
  onCopyVisualization: (visualization: Visualization) => void;
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
        <h3 className='text-lg font-semibold'>{visualization.name}</h3>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => onCopyVisualization(visualization)}
          >
            <CopyIcon className='h-4 w-4' />
          </Button>
          <AIConfig
            config={config}
            setConfig={setConfig}
            visualization={visualization}
          />
        </div>
      </div>
      <div className='h-[calc(100%-2rem)]'>
        {queryErrors[visualization.id] ? (
          <QueryErrorView error={queryErrors[visualization.id]} />
        ) : !queryResults[visualization.id] ? (
          <LoadingView />
        ) : (
          <DashboardVisualization
            dashboardViewId='llm'
            queryResult={queryResults[visualization.id]}
            config={dashbaordConfig}
          />
        )}
      </div>
    </div>
  );
}

interface AIConfigProps {
  setConfig: (config: DashboardConfig) => void;
  visualization: Visualization;
}
export function AIConfig({ setConfig, visualization }: AIConfigProps) {
  const [prompt, setPrompt] = useState("");
  const [referenceText, setReferenceText] = useState("");
  const [mode, setMode] = useState<"generate" | "reference">("generate");
  const [isLoading, setIsLoading] = useState(false);

  const handleAIAnalysis = async () => {
    try {
      // TODO: Implement AI analysis API call here
      setConfig({
        llmConfig: {
          prompt: "帮我解释这些数据",
        },
      });
      setVisualization({
        ...visualization,
        viewMode: "llm",
      });
      setIsLoading(false);
    } catch (error) {
      console.error("AI analysis failed:", error);
    } finally {
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant='ghost' size='icon' className='drag-handle'>
          <MagicWandIcon className='h-4 w-4' />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className='w-96'>
        <div className='space-y-4'>
          <Tabs
            value={mode}
            onValueChange={(value) =>
              setMode(value as "generate" | "reference")
            }
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='generate'>Generate</TabsTrigger>
              <TabsTrigger value='reference'>Reference</TabsTrigger>
            </TabsList>
            <TabsContent value='generate'>
              <div className='space-y-2'>
                <Label>Generation Prompt</Label>
                <Input
                  placeholder='Enter prompt for generation...'
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value='reference'>
              <div className='space-y-2'>
                <Label>Reference Text</Label>
                <Input
                  placeholder='Enter reference text...'
                  value={referenceText}
                  onChange={(e) => setReferenceText(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button
            onClick={handleAIAnalysis}
            disabled={
              isLoading || (mode === "generate" ? !prompt : !referenceText)
            }
            className='w-full'
          >
            {isLoading ? "Processing..." : "Analyze"}
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
