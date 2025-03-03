import { ChartConfig } from './ChartTypes';
import { cn } from '@/lib/utils';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import { DisplayFormat } from '@/config/filters';



// 图表注册表
const chartRegistry: Record<string, React.ComponentType<any>> = {};

// 注册图表组件
export function registerChart(type: string, component: React.ComponentType<any>) {
    chartRegistry[type] = component;
}

// 预注册内置图表
registerChart('bar', BarChart);
registerChart('line', LineChart);
registerChart('pie', PieChart);

interface ChartFactoryProps {
    config: ChartConfig;
    className?: string;
}

export default function ChartFactory({ config, className }: ChartFactoryProps) {
    const { chartData, options } = config;
    const chartType = chartData.type;

    // 查找已注册的图表组件
    const ChartComponent = chartRegistry[chartType];

    // 如果找到已注册的组件，则渲染它
    if (ChartComponent) {
        return <ChartComponent data={chartData.data} options={options} className={className} />;
    }

    // 未找到组件时显示占位符
    return (
        <div className={cn("h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center", className)}>
            <p className="text-gray-500 dark:text-gray-400">
                {chartType} 图表将在这里渲染
            </p>
        </div>
    );
} 