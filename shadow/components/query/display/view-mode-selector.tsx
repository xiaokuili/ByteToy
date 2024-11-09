import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useVisualization } from "@/hook/use-visualization";
import {
  TableIcon,
  BarChartIcon,
  LineChartIcon,
  PieChartIcon,
  AlignLeftIcon,
  AreaChartIcon,
  TrendingUpIcon,
  FileTextIcon,
  BarChart2Icon,
  GaugeIcon,
  ActivityIcon,
  MapIcon,
  FilterIcon, // 用 FilterIcon 替代 FunnelIcon
  HashIcon, // 用于 Number 视图
  LayoutGridIcon, // 用于 Pivot Table
} from "lucide-react";
const VIEW_MODES = {
  basic: [
    { id: "table", name: "Table", icon: TableIcon },
    { id: "bar", name: "Bar", icon: BarChartIcon },
    { id: "line", name: "Line", icon: LineChartIcon },
    { id: "pie", name: "Pie", icon: PieChartIcon },
    { id: "row", name: "Row", icon: AlignLeftIcon },
    { id: "area", name: "Area", icon: AreaChartIcon },
    { id: "combo", name: "Combo", icon: TrendingUpIcon },
    { id: "pivot", name: "Pivot Table", icon: LayoutGridIcon },
    { id: "trend", name: "Trend", icon: TrendingUpIcon },
    { id: "funnel", name: "Funnel", icon: FilterIcon },
    { id: "detail", name: "Detail", icon: FileTextIcon },
    { id: "waterfall", name: "Waterfall", icon: BarChart2Icon },
  ],
  other: [
    { id: "number", name: "Number", icon: HashIcon },
    { id: "gauge", name: "Gauge", icon: GaugeIcon },
    { id: "progress", name: "Progress", icon: ActivityIcon },
    { id: "map", name: "Map", icon: MapIcon },
  ],
};

export function ViewModeSelector() {
  const { viewMode, setViewMode } = useVisualization();
  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm font-medium'>Select View Mode</CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <Tabs defaultValue='basic' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='basic'>Basic Charts</TabsTrigger>
            <TabsTrigger value='other'>Other Charts</TabsTrigger>
          </TabsList>
          <ScrollArea className='h-[400px] px-4'>
            <TabsContent value='basic' className='mt-0 border-0 p-0'>
              <div className='grid grid-cols-3 gap-2 py-4'>
                {VIEW_MODES.basic.map((mode) => (
                  <ViewModeButton
                    key={mode.id}
                    mode={mode}
                    isSelected={viewMode === mode.id}
                    onClick={() => setViewMode(mode.id)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value='other' className='mt-0 border-0 p-0'>
              <div className='grid grid-cols-3 gap-2 py-4'>
                {VIEW_MODES.other.map((mode) => (
                  <ViewModeButton
                    key={mode.id}
                    mode={mode}
                    isSelected={viewMode === mode.id}
                    onClick={() => setViewMode(mode.id)}
                  />
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// 视图模式按钮组件
function ViewModeButton({
  mode,
  isSelected,
  onClick,
}: {
  mode: { id: string; name: string; icon: any };
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = mode.icon;

  return (
    <Button
      variant={isSelected ? "secondary" : "ghost"}
      className='flex flex-col items-center justify-center h-24 p-2 gap-2'
      onClick={onClick}
    >
      <div
        className={cn(
          "rounded-full p-2",
          isSelected ? "bg-primary/10" : "bg-muted"
        )}
      >
        <Icon className='h-4 w-4' />
      </div>
      <span className='text-xs font-medium'>{mode.name}</span>
    </Button>
  );
}
