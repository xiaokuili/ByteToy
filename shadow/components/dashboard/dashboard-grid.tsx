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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
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
    let isMounted = true;  // 用于防止组件卸载后的状态更新

    const executeQueries = async () => {
      const results: Record<string, any> = {};
      const errors: Record<string, string> = {};

      for (const block of blocks) {
        // 如果组件已卸载，停止执行
        if (!isMounted) return;
        
        try {
          const finalSql = getFinalSql(block.sqlContent, block.sqlVariables);
          const result = await executeQuery(block.datasourceId, finalSql);
          console.log(finalSql,result);

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
 
      >
        {blocks.map((block) => (
          <div key={block.id} className='bg-card border rounded-lg p-4'>
            <div className='h-full'>
              <div className="flex items-center justify-between mb-2">
                <h3 className='text-lg font-semibold'>{block.name}</h3>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-12 w-12" onMouseDown={(e) => e.stopPropagation()}>
                      <MagicWandIcon className="h-4 w-4" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80" onMouseDown={(e) => e.stopPropagation()}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Tabs defaultValue="generate">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="generate">生成</TabsTrigger>
                            <TabsTrigger value="clone">仿写</TabsTrigger>
                          </TabsList>
                          <TabsContent value="generate">
                            <div className="space-y-2">
                              <Label>生成指令</Label>
                              <Input placeholder="输入生成指令..." />
                              <Button className="w-full">生成</Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="clone">
                            <div className="space-y-2">
                              <Label>历史记录</Label>
                              <Input placeholder="输入历史记录..." />
                              <Button className="w-full">仿写</Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className='h-[calc(100%-2rem)]'>
                {queryErrors[block.id] ? (
                  <QueryErrorView error={queryErrors[block.id]} />
                ) : !queryResults[block.id] ? (
                  <LoadingView />
                ) : (
                <AICard 
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

interface AICardProps {
    viewId: string;
    queryResult: any;
}

function AICard({ viewId, queryResult }: AICardProps) {
    const [prompt, setPrompt] = useState("");
    const [example, setExample] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCloning, setIsCloning] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        try {
            // TODO: 调用AI生成接口
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error("Generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleClone = async () => {
        if (!example) return;
        setIsCloning(true);
        try {
            // TODO: 调用AI仿写接口
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error("Cloning failed:", error);
        } finally {
            setIsCloning(false);
        }
    };
    return (
            <VisualizationComponent 
                viewId={viewId}
                queryResult={queryResult}
            />
            
    );
}


