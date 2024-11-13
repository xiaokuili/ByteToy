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
              <h3 className='text-lg font-semibold mb-2'>{block.name}</h3>
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
