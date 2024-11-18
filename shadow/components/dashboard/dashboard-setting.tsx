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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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

          <TabsContent value='explore' className='border-b p-4'>
            <div className='space-y-4'>
              <div>
                <h3 className='text-sm font-medium mb-2'>搜索数据</h3>

                <div className='relative'>
                  <Input
                    type='text'
                    placeholder='搜索...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full pr-8'
                  />
                  <Search className='w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
                </div>
              </div>

              <ScrollArea className='h-[calc(100vh-300px)]'>
                {filteredVisualizations.length === 0 ? (
                  <div className='text-center text-muted-foreground py-8'>
                    未找到匹配的可视化组件
                  </div>
                ) : (
                  <div className='space-y-2'>
                    {filteredVisualizations.map((visualization) => (
                      <HoverCard key={visualization.id}>
                        <HoverCardTrigger>
                          <div
                            className='flex items-center justify-between p-3 rounded-md border hover:bg-accent/50 transition-colors cursor-pointer'
                            onClick={() => onVisualizationSelect(visualization)}
                          >
                            <div>
                              <p className='font-medium'>
                                {visualization.name}
                              </p>
                            </div>
                            <span className='text-xs text-muted-foreground px-2 py-1 bg-secondary rounded'>
                              {visualization.viewMode}
                            </span>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className='w-80'>
                          <div className='space-y-2'>
                            <p className='text-sm text-muted-foreground'>
                              点击将此可视化组件添加到仪表盘。添加后的组件可能会与现有组件重叠，您可以通过拖拽调整位置。
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value='generate' className='p-4'>
            <div className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='prompt' className='text-sm font-medium'>
                  提示词
                </Label>
                <Textarea
                  id='prompt'
                  placeholder='请输入您的提示词，描述您想要生成的内容，或者已有内容进行仿写...'
                  className='min-h-[120px] resize-none'
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='mode' className='text-sm font-medium'>
                    生成模式
                  </Label>
                  <p className='text-sm text-muted-foreground'>
                    选择是否需要基于已有内容进行仿写
                  </p>
                </div>
                <Switch id='mode' />
              </div>

              <Button className='w-full'>
                <Wand2 className='w-4 h-4 mr-2' />
                开始生成
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
