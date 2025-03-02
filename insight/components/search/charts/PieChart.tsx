import { PieChartData, ChartOptions } from './ChartTypes';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PieChartProps {
    data: PieChartData;
    options?: ChartOptions;
    className?: string;
}

export default function PieChart({ data, options, className }: PieChartProps) {
    const { labels, datasets } = data;
    const [activeSegment, setActiveSegment] = useState<number | null>(null);

    // 计算总和
    const total = datasets[0].data.reduce((sum, value) => sum + value, 0);

    // 计算每个扇区的角度和位置
    const segments = datasets[0].data.map((value, index) => {
        const percentage = (value / total) * 100;
        return {
            value,
            percentage,
            label: labels[index],
            color: datasets[0].backgroundColor[index],
            borderColor: datasets[0].borderColor?.[index] || 'white'
        };
    });

    // 生成SVG路径
    const generatePieSegments = () => {
        let cumulativePercentage = 0;

        return segments.map((segment, index) => {
            // 计算扇区的起始和结束角度
            const startAngle = (cumulativePercentage / 100) * 360;
            cumulativePercentage += segment.percentage;
            const endAngle = (cumulativePercentage / 100) * 360;

            // 转换为弧度
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);

            // 计算圆弧的端点
            const centerX = 100;
            const centerY = 100;
            const radius = data.isDonut ? 70 : 80;
            const innerRadius = data.isDonut ? 40 : 0;

            // 外圆弧端点
            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY + radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY + radius * Math.sin(endRad);

            // 内圆弧端点（如果是环形图）
            const x3 = data.isDonut ? centerX + innerRadius * Math.cos(endRad) : centerX;
            const y3 = data.isDonut ? centerY + innerRadius * Math.sin(endRad) : centerY;
            const x4 = data.isDonut ? centerX + innerRadius * Math.cos(startRad) : centerX;
            const y4 = data.isDonut ? centerY + innerRadius * Math.sin(startRad) : centerY;

            // 大圆弧标志
            const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

            // 构建路径
            let path;
            if (data.isDonut) {
                // 环形图路径
                path = `
          M ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
          L ${x3} ${y3}
          A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
          Z
        `;
            } else {
                // 饼图路径
                path = `
          M ${centerX} ${centerY}
          L ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
          Z
        `;
            }

            // 计算标签位置（在扇区中间）
            const midAngle = (startAngle + endAngle) / 2 * (Math.PI / 180);
            const labelRadius = radius * 0.7;
            const labelX = centerX + labelRadius * Math.cos(midAngle - Math.PI / 2);
            const labelY = centerY + labelRadius * Math.sin(midAngle - Math.PI / 2);

            // 计算扇区突出效果的偏移量
            const isActive = activeSegment === index;
            const offsetDistance = isActive ? 10 : 0;
            const offsetX = offsetDistance * Math.cos(midAngle - Math.PI / 2);
            const offsetY = offsetDistance * Math.sin(midAngle - Math.PI / 2);

            return {
                path,
                color: segment.color,
                borderColor: segment.borderColor,
                label: segment.label,
                value: segment.value,
                percentage: segment.percentage,
                labelX,
                labelY,
                offsetX,
                offsetY,
                index
            };
        });
    };

    const pieSegments = generatePieSegments();

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
            <div className="relative" style={{ paddingBottom: '100%' }}>
                <svg
                    viewBox="0 0 200 200"
                    className="absolute inset-0 w-full h-full"
                >
                    {/* 饼图扇区 */}
                    <g>
                        {pieSegments.map((segment) => (
                            <path
                                key={segment.index}
                                d={segment.path}
                                fill={segment.color}
                                stroke={segment.borderColor}
                                strokeWidth="1"
                                transform={`translate(${segment.offsetX}, ${segment.offsetY})`}
                                className="transition-all duration-300"
                                onMouseEnter={() => setActiveSegment(segment.index)}
                                onMouseLeave={() => setActiveSegment(null)}
                            />
                        ))}
                    </g>

                    {/* 中心圆孔（如果是环形图） */}
                    {data.isDonut && (
                        <circle
                            cx="100"
                            cy="100"
                            r="30"
                            fill="white"
                            className="dark:fill-gray-800"
                        />
                    )}

                    {/* 中心文本（如果是环形图） */}
                    {data.isDonut && activeSegment !== null && (
                        <g>
                            <text
                                x="100"
                                y="95"
                                textAnchor="middle"
                                className="text-xs font-medium fill-gray-800 dark:fill-gray-200"
                            >
                                {segments[activeSegment].label}
                            </text>
                            <text
                                x="100"
                                y="110"
                                textAnchor="middle"
                                className="text-xs fill-gray-500 dark:fill-gray-400"
                            >
                                {segments[activeSegment].percentage.toFixed(1)}%
                            </text>
                        </g>
                    )}
                </svg>
            </div>

            {/* Legend */}
            {options?.legendPosition !== 'none' && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {segments.map((segment, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2"
                            onMouseEnter={() => setActiveSegment(index)}
                            onMouseLeave={() => setActiveSegment(null)}
                        >
                            <div
                                className="w-3 h-3 rounded-sm flex-shrink-0"
                                style={{ backgroundColor: segment.color }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                                    {segment.label}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {segment.value} ({segment.percentage.toFixed(1)}%)
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 