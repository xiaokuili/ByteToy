import { LineChartData, ChartOptions } from './ChartTypes';
import { cn } from '@/lib/utils';

interface LineChartProps {
    data: LineChartData;
    options?: ChartOptions;
    className?: string;
}

export default function LineChart({ data, options, className }: LineChartProps) {
    const { labels, datasets } = data;
    const allValues = datasets.flatMap(dataset => dataset.data);
    const maxValue = Math.max(...allValues) * 1.1; // 10% padding
    const minValue = Math.min(0, ...allValues) * 1.1;
    const range = maxValue - minValue;

    // 计算点的位置
    const getPointPosition = (value: number) => {
        return 100 - ((value - minValue) / range) * 100;
    };

    return (
        <div className={cn("w-full", className)}>
            {/* Chart Title */}
            {options?.title && (
                <div className="text-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{options.title}</h3>
                    {options.subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{options.subtitle}</p>
                    )}
                </div>
            )}

            {/* Chart Container */}
            <div className="relative h-64">
                {/* Y-Axis */}
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center justify-end w-full pr-2">
                            {Math.round(maxValue - (i * range / 5))}
                        </div>
                    ))}
                </div>

                {/* Chart Area */}
                <div className="absolute left-12 right-0 top-0 bottom-6 border-l border-b border-gray-300 dark:border-gray-700">
                    {/* Grid Lines */}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute left-0 right-0 border-t border-gray-200 dark:border-gray-800"
                            style={{ top: `${i * 20}%`, height: '1px' }}
                        />
                    ))}

                    {/* Lines */}
                    <svg className="absolute inset-0 w-full h-full overflow-visible">
                        {datasets.map((dataset, datasetIndex) => {
                            const lineColor = Array.isArray(dataset.borderColor)
                                ? dataset.borderColor[0]
                                : dataset.borderColor || getDefaultColor(datasetIndex);

                            const areaColor = Array.isArray(dataset.backgroundColor)
                                ? dataset.backgroundColor[0]
                                : dataset.backgroundColor || `${lineColor.replace(')', ', 0.1)')}`;

                            // 计算路径点
                            const points = dataset.data.map((value, index) => {
                                const x = (index / (labels.length - 1)) * 100;
                                const y = getPointPosition(value);
                                return `${x}% ${y}%`;
                            });

                            const linePath = `M ${points.join(' L ')}`;

                            // 如果需要显示区域，添加区域路径
                            const areaPath = data.showArea
                                ? `${linePath} L ${(labels.length - 1) / (labels.length - 1) * 100}% 100% L 0% 100% Z`
                                : '';

                            return (
                                <g key={dataset.label}>
                                    {/* 区域填充 */}
                                    {data.showArea && (
                                        <path
                                            d={areaPath}
                                            fill={areaColor}
                                            className="transition-opacity duration-300 opacity-70 hover:opacity-90"
                                        />
                                    )}

                                    {/* 线条 */}
                                    <path
                                        d={linePath}
                                        fill="none"
                                        stroke={lineColor}
                                        strokeWidth="2"
                                        className="transition-all duration-300 hover:stroke-[3px]"
                                    />

                                    {/* 数据点 */}
                                    {dataset.data.map((value, index) => {
                                        const x = (index / (labels.length - 1)) * 100;
                                        const y = getPointPosition(value);

                                        return (
                                            <circle
                                                key={index}
                                                cx={`${x}%`}
                                                cy={`${y}%`}
                                                r="3"
                                                fill="white"
                                                stroke={lineColor}
                                                strokeWidth="2"
                                                className="transition-all duration-300 hover:r-4"
                                                data-tooltip-id="chart-tooltip"
                                                data-tooltip-content={`${dataset.label}: ${value}`}
                                            />
                                        );
                                    })}
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* X-Axis Labels */}
                <div className="absolute left-12 right-0 bottom-0 h-6 flex justify-between">
                    {labels.map((label, index) => (
                        <div
                            key={label}
                            className="text-center text-xs text-gray-500 dark:text-gray-400 truncate px-1"
                            style={{
                                position: 'absolute',
                                left: `${index / (labels.length - 1) * 100}%`,
                                transform: 'translateX(-50%)',
                                width: '60px'
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            {options?.legendPosition !== 'none' && datasets.length > 1 && (
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                    {datasets.map((dataset, index) => {
                        const color = Array.isArray(dataset.borderColor)
                            ? dataset.borderColor[0]
                            : dataset.borderColor || getDefaultColor(index);

                        return (
                            <div key={dataset.label} className="flex items-center">
                                <div
                                    className="w-6 h-[2px] mr-1"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-xs text-gray-700 dark:text-gray-300">{dataset.label}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// 默认颜色函数
function getDefaultColor(index: number): string {
    const colors = [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)',
        'rgba(40, 159, 110, 1)',
        'rgba(210, 105, 30, 1)'
    ];

    return colors[index % colors.length];
} 