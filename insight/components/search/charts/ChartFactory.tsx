import { ChartConfig } from './ChartTypes';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import { cn } from '@/lib/utils';
import { DisplayFormatType, displayFormatMap } from '@/config/filters';

interface ChartFactoryProps {
    config: ChartConfig;
    className?: string;
}

export default function ChartFactory({ config, className }: ChartFactoryProps) {
    const { chartData, options } = config;
    const chartType = chartData.type;

    // 根据图表类型渲染对应的图表组件
    switch (chartType) {
        case 'bar':
            return <BarChart data={chartData.data} options={options} className={className} />;

        case 'line':
            return <LineChart data={chartData.data} options={options} className={className} />;

        case 'pie':
            return <PieChart data={chartData.data} options={options} className={className} />;

        case 'scatter':
            // 暂未实现散点图，显示占位符
            return (
                <div className={cn("h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center", className)}>
                    <p className="text-gray-500 dark:text-gray-400">
                        散点图将在这里渲染
                    </p>
                </div>
            );

        case 'radar':
            // 暂未实现雷达图，显示占位符
            return (
                <div className={cn("h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center", className)}>
                    <p className="text-gray-500 dark:text-gray-400">
                        雷达图将在这里渲染
                    </p>
                </div>
            );

        default:
            return (
                <div className={cn("h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center", className)}>
                    <p className="text-gray-500 dark:text-gray-400">
                        未知图表类型
                    </p>
                </div>
            );
    }
} 