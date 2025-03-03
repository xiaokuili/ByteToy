import { RadarChartData, ChartOptions } from './ChartTypes';
import { cn } from '@/lib/utils';
import { registerChart } from './ChartFactory';

interface RadarChartProps {
    data: RadarChartData;
    options?: ChartOptions;
    className?: string;
}

export default function RadarChart({ data, options, className }: RadarChartProps) {
    const { labels, datasets } = data;
    const allValues = datasets.flatMap(dataset => dataset.data);
    const maxValue = Math.max(...allValues) * 1.1; // 10% padding

    // 计算多边形的点
    const getPolygonPoints = (values: number[], scale: number = 1) => {
        const centerX = 50;
        const centerY = 50;
        const radius = 40 * scale;

        return values.map((value, i) => {
            const percentage = value / maxValue;
            const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
            const x = centerX + radius * percentage * Math.cos(angle);
            const y = centerY + radius * percentage * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    };

    // 计算轴线的端点
    const getAxisEndPoint = (index: number, length: number) => {
        const centerX = 50;
        const centerY = 50;
        const radius = 40;
        const angle = (Math.PI * 2 * index) / length - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return { x, y };
    };

    // 计算标签位置
    const getLabelPosition = (index: number, length: number) => {
        const centerX = 50;
        const centerY = 50;
        const radius = 45;
        const angle = (Math.PI * 2 * index) / length - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        return { x, y };
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

            {/* 雷达图 */}
            <div className="relative h-full w-full">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* 背景网格 */}
                    {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
                        <polygon
                            key={`grid-${i}`}
                            points={getPolygonPoints(Array(labels.length).fill(maxValue), scale)}
                            fill="none"
                            stroke="rgba(156, 163, 175, 0.3)"
                            strokeWidth="0.5"
                        />
                    ))}

                    {/* 轴线 */}
                    {labels.map((_, i) => {
                        const end = getAxisEndPoint(i, labels.length);
                        return (
                            <line
                                key={`axis-${i}`}
                                x1="50"
                                y1="50"
                                x2={end.x}
                                y2={end.y}
                                stroke="rgba(156, 163, 175, 0.5)"
                                strokeWidth="0.5"
                            />
                        );
                    })}

                    {/* 数据多边形 */}
                    {datasets.map((dataset, datasetIndex) => {
                        const color = dataset.backgroundColor
                            ? (Array.isArray(dataset.backgroundColor)
                                ? dataset.backgroundColor[0]
                                : dataset.backgroundColor)
                            : getDefaultColor(datasetIndex);

                        const borderColor = dataset.borderColor
                            ? (Array.isArray(dataset.borderColor)
                                ? dataset.borderColor[0]
                                : dataset.borderColor)
                            : color;

                        return (
                            <polygon
                                key={`dataset-${datasetIndex}`}
                                points={getPolygonPoints(dataset.data)}
                                fill={color}
                                fillOpacity="0.2"
                                stroke={borderColor}
                                strokeWidth={dataset.borderWidth || 2}
                            />
                        );
                    })}

                    {/* 数据点 */}
                    {datasets.map((dataset, datasetIndex) => {
                        const color = dataset.backgroundColor
                            ? (Array.isArray(dataset.backgroundColor)
                                ? dataset.backgroundColor[0]
                                : dataset.backgroundColor)
                            : getDefaultColor(datasetIndex);

                        return dataset.data.map((value, valueIndex) => {
                            const percentage = value / maxValue;
                            const angle = (Math.PI * 2 * valueIndex) / labels.length - Math.PI / 2;
                            const centerX = 50;
                            const centerY = 50;
                            const radius = 40;
                            const x = centerX + radius * percentage * Math.cos(angle);
                            const y = centerY + radius * percentage * Math.sin(angle);

                            return (
                                <circle
                                    key={`point-${datasetIndex}-${valueIndex}`}
                                    cx={x}
                                    cy={y}
                                    r="1.5"
                                    fill={color}
                                />
                            );
                        });
                    })}

                    {/* 标签 */}
                    {labels.map((label, i) => {
                        const pos = getLabelPosition(i, labels.length);
                        return (
                            <text
                                key={`label-${i}`}
                                x={pos.x}
                                y={pos.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="3"
                                fill="currentColor"
                                className="text-gray-600 dark:text-gray-300"
                            >
                                {label}
                            </text>
                        );
                    })}
                </svg>
            </div>

            {/* 图例 */}
            {options?.legendPosition !== 'none' && (
                <div className={cn("flex flex-wrap justify-center gap-4", {
                    "mt-4": options?.legendPosition === 'bottom' || !options?.legendPosition,
                    "mb-4": options?.legendPosition === 'top',
                    "flex-col items-start": options?.legendPosition === 'left',
                    "flex-col items-end": options?.legendPosition === 'right',
                })}>
                    {datasets.map((dataset, index) => {
                        const color = dataset.backgroundColor
                            ? (Array.isArray(dataset.backgroundColor)
                                ? dataset.backgroundColor[0]
                                : dataset.backgroundColor)
                            : getDefaultColor(index);

                        return (
                            <div key={index} className="flex items-center">
                                <div
                                    className="w-3 h-3 rounded-full mr-1"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-xs">{dataset.label}</span>
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
        '#4361ee', '#3a0ca3', '#7209b7', '#f72585',
        '#4cc9f0', '#4895ef', '#560bad', '#f15bb5',
        '#fee440', '#00bbf9', '#00f5d4', '#9b5de5'
    ];
    return colors[index % colors.length];
}

// 注册雷达图组件
registerChart('radar', RadarChart); 