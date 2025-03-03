/**
 * 图表示例数据
 * 
 * 本文件包含各种图表类型的示例数据，可用于开发和测试。
 * 同时也作为文档，说明如何使用和扩展图表系统。
 */

import {
    ChartConfig,
    BarChartData,
    LineChartData,
    PieChartData,
    ScatterChartData,
    RadarChartData,
    ChartOptions
} from './ChartTypes';

// ======================================================
// 图表选项示例
// ======================================================

/**
 * 通用图表选项示例
 * 这些选项适用于所有类型的图表
 */
export const commonChartOptions: ChartOptions = {
    title: '图表标题',
    subtitle: '图表副标题',
    xAxisLabel: 'X轴标签',
    yAxisLabel: 'Y轴标签',
    legendPosition: 'bottom', // 'top' | 'bottom' | 'left' | 'right' | 'none'
    aspectRatio: 2, // 宽高比
    animation: true,
    responsive: true,
    theme: 'light', // 'light' | 'dark' | 'auto'
};

// ======================================================
// 柱状图示例
// ======================================================

/**
 * 柱状图数据示例
 * 
 * 柱状图用于比较不同类别的数据
 * - labels: 每个柱子的标签
 * - datasets: 数据集合，可以有多个系列
 */
export const barChartData: BarChartData = {
    labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
    datasets: [
        {
            label: '销售额',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: '#4361ee',
            borderColor: '#3a0ca3',
            borderWidth: 1
        },
        {
            label: '利润',
            data: [28, 48, 40, 19, 86, 27],
            backgroundColor: '#f72585',
            borderColor: '#7209b7',
            borderWidth: 1
        }
    ]
};

/**
 * 柱状图配置示例
 */
export const barChartConfig: ChartConfig = {
    chartData: {
        type: 'bar',
        data: barChartData
    },
    options: {
        ...commonChartOptions,
        title: '月度销售数据',
        subtitle: '销售额与利润对比'
    }
};

// ======================================================
// 折线图示例
// ======================================================

/**
 * 折线图数据示例
 * 
 * 折线图用于显示数据随时间的变化趋势
 * - labels: 时间点标签
 * - datasets: 数据集合，可以有多个系列
 * - showArea: 是否显示面积
 * - tension: 曲线平滑度 (0-1)
 */
export const lineChartData: LineChartData = {
    labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
    datasets: [
        {
            label: '网站访问量',
            data: [4500, 5000, 6500, 7800, 9000, 12000],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2
        },
        {
            label: '转化率',
            data: [1200, 1900, 3000, 5000, 4000, 6000],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2
        }
    ],
    showArea: true,
    tension: 0.4
};

/**
 * 折线图配置示例
 */
export const lineChartConfig: ChartConfig = {
    chartData: {
        type: 'line',
        data: lineChartData
    },
    options: {
        ...commonChartOptions,
        title: '网站流量趋势',
        subtitle: '过去6个月的数据'
    }
};

// ======================================================
// 饼图/环形图示例
// ======================================================

/**
 * 饼图数据示例
 * 
 * 饼图用于显示部分与整体的关系
 * - labels: 每个扇区的标签
 * - datasets: 数据集合，通常只有一个
 * - isDonut: 是否为环形图
 */
export const pieChartData: PieChartData = {
    labels: ['产品A', '产品B', '产品C', '产品D', '产品E'],
    datasets: [{
        data: [300, 50, 100, 40, 120],
        backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ],
        borderColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ],
        borderWidth: 1,
        hoverOffset: 4
    }],
    isDonut: false // 设置为true则显示为环形图
};

/**
 * 饼图配置示例
 */
export const pieChartConfig: ChartConfig = {
    chartData: {
        type: 'pie',
        data: pieChartData
    },
    options: {
        title: '产品销售占比',
        legendPosition: 'right'
    }
};

/**
 * 环形图配置示例
 */
export const donutChartConfig: ChartConfig = {
    chartData: {
        type: 'pie',
        data: {
            ...pieChartData,
            isDonut: true
        }
    },
    options: {
        title: '产品销售占比 (环形图)',
        legendPosition: 'bottom'
    }
};

// ======================================================
// 散点图示例
// ======================================================

/**
 * 散点图数据示例
 * 
 * 散点图用于显示两个变量之间的关系
 * - datasets: 数据集合，每个点有x和y坐标
 */
export const scatterChartData: ScatterChartData = {
    datasets: [
        {
            label: '数据集A',
            data: [
                { x: 10, y: 20 },
                { x: 15, y: 10 },
                { x: 20, y: 30 },
                { x: 25, y: 15 },
                { x: 30, y: 25 },
                { x: 35, y: 35 },
                { x: 40, y: 40 },
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            pointRadius: 5
        },
        {
            label: '数据集B',
            data: [
                { x: 12, y: 25 },
                { x: 18, y: 18 },
                { x: 22, y: 35 },
                { x: 28, y: 12 },
                { x: 32, y: 28 },
                { x: 38, y: 32 },
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            pointRadius: 5
        }
    ]
};

/**
 * 散点图配置示例
 */
export const scatterChartConfig: ChartConfig = {
    chartData: {
        type: 'scatter',
        data: scatterChartData
    },
    options: {
        ...commonChartOptions,
        title: '身高与体重关系',
        xAxisLabel: '身高 (cm)',
        yAxisLabel: '体重 (kg)'
    }
};

// ======================================================
// 雷达图示例
// ======================================================

/**
 * 雷达图数据示例
 * 
 * 雷达图用于比较多个变量的数据
 * - labels: 每个轴的标签
 * - datasets: 数据集合，可以有多个系列
 */
export const radarChartData: RadarChartData = {
    labels: ['攻击', '防御', '速度', '生命值', '魔法值', '技能'],
    datasets: [
        {
            label: '角色A',
            data: [65, 59, 90, 81, 56, 55],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2
        },
        {
            label: '角色B',
            data: [28, 48, 40, 19, 96, 27],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
        }
    ]
};

/**
 * 雷达图配置示例
 */
export const radarChartConfig: ChartConfig = {
    chartData: {
        type: 'radar',
        data: radarChartData
    },
    options: {
        title: '角色能力对比',
        legendPosition: 'bottom'
    }
};

// ======================================================
// 如何添加新的图表类型
// ======================================================

/**
 * 添加新的图表类型的步骤:
 *
 * 1. 在 ChartTypes.ts 中定义新的图表数据接口
 *
 * ```typescript
 * // 例如，添加热力图
 * export interface HeatmapChartData {
 *   data: Array<{x: number; y: number; value: number}>;
 *   xLabels?: string[];
 *   yLabels?: string[];
 *   colorScale?: string[];
 * }
 * ```
 *
 * 2. 扩展 ChartType 类型
 *
 * ```typescript
 * export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'radar' | 'heatmap';
 * ```
 *
 * 3. 扩展 ChartData 联合类型
 *
 * ```typescript
 * export type ChartData =
 *   | { type: 'bar'; data: BarChartData }
 *   | { type: 'line'; data: LineChartData }
 *   | { type: 'pie'; data: PieChartData }
 *   | { type: 'scatter'; data: ScatterChartData }
 *   | { type: 'radar'; data: RadarChartData }
 *   | { type: 'heatmap'; data: HeatmapChartData };
 * ```
 *
 * 4. 扩展 ChartComponentProps 接口
 *
 * ```typescript
 * export interface ChartComponentProps {
 *   bar: { data: BarChartData; options?: ChartOptions; className?: string };
 *   line: { data: LineChartData; options?: ChartOptions; className?: string };
 *   pie: { data: PieChartData; options?: ChartOptions; className?: string };
 *   scatter: { data: ScatterChartData; options?: ChartOptions; className?: string };
 *   radar: { data: RadarChartData; options?: ChartOptions; className?: string };
 *   heatmap: { data: HeatmapChartData; options?: ChartOptions; className?: string };
 * }
 * ```
 *
 * 5. 创建新的图表组件 (例如 HeatmapChart.tsx)
 *
 * ```typescript
 * import { HeatmapChartData, ChartOptions, GenericChartProps } from './ChartTypes';
 * import { cn } from '@/lib/utils';
 * import { getDefaultColor, calculateRange } from './chartUtils';
 *
 * type HeatmapChartProps = GenericChartProps<'heatmap'>;
 *
 * export default function HeatmapChart({ data, options, className }: HeatmapChartProps) {
 *   // 实现热力图渲染逻辑
 *   return (
 *     <div className={cn("relative h-64 w-full", className)}></div>
 *   );
 * }
 *
 *
*
 *
 * ```
 *
 * 6. 在 registerCharts.ts 中注册新的图表组件
 *
 * ```typescript
    * import HeatmapChart from './HeatmapChart';
 *
 * export function registerBuiltinCharts(): void {
 *   // 注册现有图表
 * registerChart('bar', BarChart);
 *   // ...
 *
 *   // 注册新图表
 * registerChart('heatmap', HeatmapChart);
 * }
 * ```
 *
 * 7. 在 ChartExamples.ts 中添加新图表的示例数据
 *
 * ```typescript
    * export const heatmapChartData: HeatmapChartData = {
        *   data: [
            *     { x: 0, y: 0, value: 10 },
            *     { x: 0, y: 1, value: 20 },
            *     // ...更多数据点
 *],
        *   xLabels: ['A', 'B', 'C'],
        *   yLabels: ['1', '2', '3']
 * };
 *
 * export const heatmapChartConfig: ChartConfig = {
    *   chartData: {
 *     type: 'heatmap',
    *     data: heatmapChartData
 *   },
 * options: {
 * title: '热力图示例'
        *   }
 * };
 * ```
 */

// ======================================================
// 使用示例
// ======================================================

/**
 * 在组件中使用图表的示例:
 * 
 * ```tsx
    * import { ChartFactory } from '@/components/search/charts/ChartFactory';
 * import { barChartConfig } from '@/components/search/charts/ChartExamples';
 * 
 * export default function ChartDemo() {
 *   return (
 * <div className= "p-4" >
 * <h1 className="text-2xl font-bold mb-4" > 图表示例 </h1>
        * <div className="mb-8" >
 * <ChartFactory config={ barChartConfig } className = "h-80" />
 * </div>
        * </div>
        *   );
 * }
 * ```
 * 
 * 动态创建图表配置:
 * 
 * ```tsx
    * import { ChartFactory } from '@/components/search/charts/ChartFactory';
 * import { ChartConfig } from '@/components/search/charts/ChartTypes';
 * 
 * export default function DynamicChart({ data }) {
 *   // 根据数据创建图表配置
 *   const chartConfig: ChartConfig = {
        *     chartData: {
 *       type: 'bar',
        *       data: {
 *         labels: data.map(item => item.name),
 * datasets: [{
        *           label: '数量',
        *           data: data.map(item => item.value),
 * backgroundColor: '#4361ee'
    *         }]
 *       }
 *     },
 * options: {
 * title: '动态数据图表'
        *     }
 *   };
 * 
 *   return <ChartFactory config={ chartConfig } />;
 * }
 * ```
 */ 