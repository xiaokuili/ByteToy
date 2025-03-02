import { BarChartData, ChartOptions } from './ChartTypes';
import { cn } from '@/lib/utils';

interface BarChartProps {
    data: BarChartData;
    options?: ChartOptions;
    className?: string;
}

export default function BarChart({ data, options, className }: BarChartProps) {
    const { labels, datasets } = data;
    const maxValue = Math.max(...datasets.flatMap(dataset => dataset.data)) * 1.1; // 10% padding

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
                            {Math.round(maxValue * (5 - i) / 5)}
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

                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end">
                        <div className="w-full flex justify-around">
                            {labels.map((label, labelIndex) => (
                                <div key={label} className="flex-1 flex justify-center items-end h-full">
                                    {/* Bar Group */}
                                    <div className="flex items-end space-x-1 w-full max-w-[50px]">
                                        {datasets.map((dataset, datasetIndex) => {
                                            const value = dataset.data[labelIndex] || 0;
                                            const height = `${(value / maxValue) * 100}%`;
                                            const bgColor = Array.isArray(dataset.backgroundColor)
                                                ? dataset.backgroundColor[labelIndex]
                                                : dataset.backgroundColor || getDefaultColor(datasetIndex);

                                            return (
                                                <div
                                                    key={`${label}-${dataset.label}`}
                                                    className="flex-1 rounded-t transition-all duration-500 hover:opacity-80"
                                                    style={{
                                                        height,
                                                        backgroundColor: bgColor,
                                                        minWidth: '8px'
                                                    }}
                                                    title={`${dataset.label}: ${value}`}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* X-Axis Labels */}
                <div className="absolute left-12 right-0 bottom-0 h-6 flex justify-around">
                    {labels.map(label => (
                        <div key={label} className="flex-1 text-center text-xs text-gray-500 dark:text-gray-400 truncate px-1">
                            {label}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            {options?.legendPosition !== 'none' && datasets.length > 1 && (
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                    {datasets.map((dataset, index) => (
                        <div key={dataset.label} className="flex items-center">
                            <div
                                className="w-3 h-3 mr-1 rounded-sm"
                                style={{
                                    backgroundColor: Array.isArray(dataset.backgroundColor)
                                        ? dataset.backgroundColor[0]
                                        : dataset.backgroundColor || getDefaultColor(index)
                                }}
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">{dataset.label}</span>
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
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
        'rgba(40, 159, 110, 0.7)',
        'rgba(210, 105, 30, 0.7)'
    ];

    return colors[index % colors.length];
} 