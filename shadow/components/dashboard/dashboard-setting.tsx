"use client";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { listVisualizations } from "@/lib/visualization-actions";
import { Visualization } from "@/types/base";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2 } from "lucide-react"; // 修改这行

interface VisualizationSettingProps {
  onVisualizationSelect: (visualization: Visualization) => void;
}

export function VisualizationSetting({
  onVisualizationSelect,
}: VisualizationSettingProps) {
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchVisualizations = async () => {
      const visualizationResult = await listVisualizations();
      setVisualizations(visualizationResult.data);
    };
    fetchVisualizations();
  }, []);

  const filteredVisualizations = visualizations.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='w-full h-screen flex flex-col'>
      {/* Header */}
      <div className='p-4'>
        <h2 className='text-lg font-semibold'>仪表盘设置</h2>
      </div>

      <div className='flex-1 flex flex-col p-4 '>
        <Tabs defaultValue='explore' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='explore' className='flex items-center gap-2'>
              <Search className='w-4 h-4' />
              数据探索
            </TabsTrigger>
            <TabsTrigger value='generate' className='flex items-center gap-2'>
              <Wand2 className='w-4 h-4' />
              内容生成
            </TabsTrigger>
          </TabsList>

          <TabsContent value='explore' className='border-b'>
            <div className='relative'>
              <Input
                type='text'
                placeholder='搜索数据...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pr-8'
              />
              <Search className='w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
            </div>
            <ScrollArea className='mt-4 h-[calc(100vh-200px)]'>
              <div className='grid gap-2'>
                {filteredVisualizations.map((visualization) => (
                  <Card
                    key={visualization.id}
                    className='cursor-pointer hover:bg-accent/50 transition-colors'
                    onClick={() => onVisualizationSelect(visualization)}
                  >
                    <CardHeader className='p-3'>
                      <div className='flex items-center justify-between'>
                        <CardTitle className='text-sm font-medium'>
                          {visualization.name}
                        </CardTitle>
                        <span className='text-xs text-muted-foreground px-2 py-1 bg-secondary rounded'>
                          {visualization.viewMode}
                        </span>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value='generate' className='p-4'>
            <div className='text-center text-muted-foreground'>
              内容生成功能开发中...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
