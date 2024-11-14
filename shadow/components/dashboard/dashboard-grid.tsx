"use client";

import { Visualization } from "@/types/base";
import { useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useState } from "react";
import { Visualization as VisualizationComponent } from "@/components/query/display/visualization";
import { executeQuery } from "@/lib/datasource-action";
import { getFinalSql } from "@/utils/variable-utils";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  blocks: Visualization[];
}

export function LoadingView() {
  return <div>Loading...</div>;
}

export function QueryErrorView({ error }: { error: string }) {
  return <div>{error}</div>;
}

export function DashboardGrid({ blocks }: DashboardGridProps) {
  const [queryResults, setQueryResults] = useState<Record<string, any>>({});
  const [queryErrors, setQueryErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    let isMounted = true; // 用于防止组件卸载后的状态更新

    const executeQueries = async () => {
      const results: Record<string, any> = {};
      const errors: Record<string, string> = {};

      for (const block of blocks) {
        // 如果组件已卸载，停止执行
        if (!isMounted) return;

        try {
          const finalSql = getFinalSql(block.sqlContent, block.sqlVariables);
          const result = await executeQuery(block.datasourceId, finalSql);
          console.log(finalSql, result);

          if (result.success) {
            results[block.id] = result.data;
          } else {
            errors[block.id] = result.error || "Unknown error";
          }
        } catch (error) {
          console.error(`Error executing query for block ${block.id}:`, error);
          errors[block.id] = "Failed to execute query";
        }
      }
      console.log(blocks);
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
  }, [blocks]);

  const layouts = {
    lg: blocks.map((block, index) => ({
      i: block.id,
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
        {blocks.map((block) => (
          <div key={block.id} className='bg-card border rounded-lg p-4'>
            <div className='h-full'>
              <div className='flex items-center justify-between mb-2 no-drag'>
                <h3 className='text-lg font-semibold'>{block.name}</h3>
                <AIConfig />
              </div>
              <div className='h-[calc(100%-2rem)]'>
                {queryErrors[block.id] ? (
                  <QueryErrorView error={queryErrors[block.id]} />
                ) : !queryResults[block.id] ? (
                  <LoadingView />
                ) : (
                  <VisualizationComponent
                    viewId={block.viewMode}
                    queryResult={queryResults[block.id]}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
export function AIConfig() {
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [referenceText, setReferenceText] = useState("");
  const [mode, setMode] = useState<"generate" | "reference">("generate");

  const handleAIAnalysis = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement AI analysis API call here
      const mockResponse =
        mode === "generate"
          ? `Generated response based on: ${prompt}`
          : `Response mimicking style of: ${referenceText}`;
      setAiResponse(mockResponse);
    } catch (error) {
      console.error("AI analysis failed:", error);
    } finally {
      setIsLoading(false);
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

          {aiResponse && (
            <div className='space-y-2'>
              <Label>Result</Label>
              <p className='text-sm'>{aiResponse}</p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
