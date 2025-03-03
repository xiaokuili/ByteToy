import { ScatterChartData, ChartOptions } from './ChartTypes';
import { cn } from '@/lib/utils';
import { registerChart } from './ChartFactory';

interface ScatterChartProps {
    data: ScatterChartData;
    options?: ChartOptions;
    className?: string;
}

export default function ScatterChart({ data, options, className }: ScatterChartProps) {
    const { datasets } = data;
    const allXValues = datasets.flatMap(dataset => dataset.data.map(point => point.x));
    const allYValues = datasets.flatMap(dataset => dataset.data.map(point => point.y));

    const maxX = Math.max(...allXValues) * 1.1; // 10% padding
    const minX = Math.min(0, ...allXValues);
    const maxY = Math.max(...allYValues) * 1.1; // 10% padding
    const minY = Math.min(0, ...allYValues);

    const xRange = maxX - minX;
    const yRange = maxY - minY;

    // 计算点的位置
    const getXPosition = (x: number) => {
        return ((x - minX) / xRange) * 100;
    };

    const getYPosition = (y: number) => {
        return 100 - ((y - minY) / yRange) * 100;
    };

    return (
        <div className={cn("relative h-64 w-full bg-white dark:bg-gray-900 rounded-lg p-4", className)}>
            {/* 图表标题 */}
            {options?.title && (
                <div className="text-center mb-4">
                    <h3 className="text-lg font-medium">{options.title}</h3>
                    {options.subtitle && <p className="text-sm text-gray-500">{options.subtitle}</p>}
                </div>
            )}

            {/* 散点图 */}
            <div className="relative h-full w-full">
                {/* 坐标轴 */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gray-300 dark:bg-gray-700" />
                <div className="absolute bottom-0 left-0 h-full w-px bg-gray-300 dark:bg-gray-700" />

                {/* 数据点 */}
                {datasets.map((dataset, datasetIndex) => (
                    <div key={datasetIndex}>
                        {dataset.data.map((point, pointIndex) => {
                            const x = getXPosition(point.x);
                            const y = getYPosition(point.y);
                            const radius = dataset.pointRadius || 4;
                            const color = dataset.backgroundColor || getDefaultColor(datasetIndex);

                            return (
                                <div
                                    key={pointIndex}
                                    className="absolute rounded-full"
                                    style={{
                                        left: `${x}%`,
                                        top: `${y}%`,
                                        width: `${radius * 2}px`,
                                        height: `${radius * 2}px`,
                                        backgroundColor: color,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                    title={`(${point.x}, ${point.y})`}
                                />
                            );
                        })}
                    </div>
                ))}

                {/* 坐标轴标签 */}
                {options?.xAxisLabel && (
                    <div className="absolute bottom-[-24px] w-full text-center text-xs text-gray-500">
                        {options.xAxisLabel}
                    </div>
                )}
                {options?.yAxisLabel && (
                    <div className="absolute left-[-40px] h-full flex items-center">
                        <div className="transform -rotate-90 text-xs text-gray-500 whitespace-nowrap">
                            {options.yAxisLabel}
                        </div>
                    </div>
                )}
            </div>

            {/* 图例 */}
            {options?.legendPosition !== 'none' && (
                <div className={cn("flex flex-wrap justify-center gap-4 mt-4", {
                    "mt-4": options?.legendPosition === 'bottom' || !options?.legendPosition,
                    "mb-4": options?.legendPosition === 'top',
                    "flex-col items-start": options?.legendPosition === 'left',
                    "flex-col items-end": options?.legendPosition === 'right',
                })}>
                    {datasets.map((dataset, index) => (
                        <div key={index} className="flex items-center">
                            <div
                                className="w-3 h-3 rounded-full mr-1"
                                style={{ backgroundColor: dataset.backgroundColor || getDefaultColor(index) }}
                            />
                            <span className="text-xs">{dataset.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// 默认颜色函数
function getDefaultColor(index: number): string {
    const colors = [
        '#4361ee', '#3a0ca3', '#7209b7', '#f72585',
        '#4cc9f0', '#4895ef', '#560bad', '#f15bb5',
        '#fee440', '#00bbf9', '#00f5d4', '#9b5de5'
    ];
    return colors[index % colors.length];
}

// 注册散点图组件
registerChart('scatter', ScatterChart); 