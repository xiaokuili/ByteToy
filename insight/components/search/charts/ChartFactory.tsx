import React from 'react';
import { ChartConfig, ChartData } from './ChartTypes';
import { cn } from '@/lib/utils';

// 确保在应用启动时注册所有图表
import './registerCharts';
import { registerBuiltinCharts, chartRegistry } from './registerCharts';

// 预注册内置图表
registerBuiltinCharts();

// 图表工厂组件的属性
interface ChartFactoryProps {
    config: ChartConfig;
    className?: string;
}

/**
 * 图表工厂组件
 * 根据配置渲染相应的图表组件
 */
export default function ChartFactory({ config, className }: ChartFactoryProps) {
    const { chartData, options } = config;
    const chartType = chartData.type;

    // 如果找到已注册的组件，则渲染它
    if (chartRegistry.hasComponent(chartType)) {
        const ChartComponent = chartRegistry.getComponent(chartType)!;
        return <ChartComponent data={chartData.data} options={options} className={className} />;
    }

    // 未找到组件时显示占位符
    return <ChartPlaceholder chartType={chartType} className={className} />;
}

// 图表占位符组件
interface ChartPlaceholderProps {
    chartType: string;
    className?: string;
}

function ChartPlaceholder({ chartType, className }: ChartPlaceholderProps) {
    return (
        <div className={cn("h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center", className)}>
            <p className="text-gray-500 dark:text-gray-400">
                {chartType} 图表将在这里渲染
            </p>
        </div>
    );
} 