"use client";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { listVisualizations } from "@/lib/visualization-actions";
import { DashboardSection, Visualization } from "@/types/base";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2 } from "lucide-react"; // 修改这行
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useDashboardActive , useDashboardOperations} from "@/hook/use-dashboard";

interface VisualizationSettingProps {
  onUpdateSection: (id: string, section: Partial<DashboardSection>) => void;
}
export function VisualizationSetting({
  onUpdateSection,
}: VisualizationSettingProps) {
  const [visualizations, setVisualizations] = useState<Visualization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { activeId } = useDashboardActive();
  const { sections } = useDashboardOperations();
  const activeSection = sections?.find(section => section.id === activeId);

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
      <div className='p-4'>
        <h2 className='text-lg font-semibold'>仪表盘设置</h2>
      </div>

      <div className='flex-1 flex flex-col p-4'>
        <Tabs defaultValue='explore' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='explore' className='flex items-center gap-2'>
              <Search className='w-4 h-4' />
              基本配置
            </TabsTrigger>
            <TabsTrigger value='generate' className='flex items-center gap-2'>
              <Wand2 className='w-4 h-4' />
              内容生成
            </TabsTrigger>
          </TabsList>

          <TabsContent value='explore' className='border-b p-4'>
            <div className='space-y-4'>
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <h3 className='text-sm font-medium'>标题配置</h3>
                </div>
                <div className='relative'>
                  <Input
                    type='text'
                    placeholder='请输入标题...'
                    value={activeSection?.name || ''}
                    onChange={(e) => {
                      onUpdateSection(activeId, {
                        name: e.target.value,
                      });

                    }}
                    className='w-full'
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <h3 className='text-sm font-medium'>数据配置</h3>
                </div>
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

                <ScrollArea className='h-[calc(100vh-380px)]'>
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
                              onClick={() => {
                                onUpdateSection(activeId, {
                                  viewId: visualization.id,
                                  viewMode: visualization.viewMode,
                                  sqlContent: visualization.sqlContent,
                                  sqlVariables: visualization.sqlVariables,
                                  databaseId: visualization.datasourceId,
                                });
                              }}
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
            </div>
          </TabsContent>

          <TabsContent value='generate' className='p-4'>
            <div className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Label htmlFor='prompt' className='text-sm font-medium'>
                    提示词
                  </Label>
                </div>
                <div>
                  <Textarea
                    id='prompt'
                    placeholder='请输入您的提示词，描述您想要生成的内容，或者已有内容进行仿写...'
                    className='min-h-[120px] resize-none'
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Label className='text-sm font-medium'>生成模式</Label>
                </div>
                <div>
                  <RadioGroup defaultValue='imitate' className='pt-2'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors'>
                        <RadioGroupItem value='imitate' id='imitate' />
                        <div className='space-y-1'>
                          <Label htmlFor='imitate' className='font-medium'>
                            仿写
                          </Label>
                          <p className='text-xs text-muted-foreground'>
                            基于已有内容进行相似生成
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors'>
                        <RadioGroupItem value='generate' id='generate' />
                        <div className='space-y-1'>
                          <Label htmlFor='generate' className='font-medium'>
                            生成
                          </Label>
                          <p className='text-xs text-muted-foreground'>
                            根据提示词创建新内容
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Label className='text-sm font-medium'>开始生成</Label>
                </div>
                <div>
                  <Button
                    className='w-full'
                    onClick={() => {
                      const promptValue =
                        (
                          document.getElementById(
                            "prompt"
                          ) as HTMLTextAreaElement
                        )?.value || "";
                      const llmType = (
                        document.querySelector(
                          'input[name="radix-:r0:"]:checked'
                        ) as HTMLInputElement
                      )?.value as "imitate" | "generate";
                      onUpdateSection(activeId, {
                        type: "LLM",
                        llmConfig: {
                          llmType,
                          prompt: promptValue,
                        },
                      });
                    }}
                  >
                    <Wand2 className='w-4 h-4 mr-2' />
                    开始生成
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
