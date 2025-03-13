"use client";

import {
    Bar,
    BarChart,
    Line,
    LineChart,
    Area,
    AreaChart,
    Pie,
    PieChart,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    Label
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {  ChartConfig, RenderConfig, Render,  DataRecord } from "@/lib/types";
import { transformDataForMultiLineChart } from "@/lib/rechart-format";
import { cn } from "@/lib/utils";

function toTitleCase(str: string): string {
    return str
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

const defaultColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-7))",
    "hsl(var(--chart-8))",
];

interface ChartFactoryProps {
    config: ChartConfig;
    className?: string;
    chartData: DataRecord[];
}

export default function ChartFactory({ config, className, chartData }: ChartFactoryProps) {
    const { options } = config;

    if (!chartData || !options) {
        return <div>No chart data</div>;
    }

    const parsedChartData = chartData.map((item) => {
        const parsedItem: { [key: string]: string | number } = {};
        for (const [key, value] of Object.entries(item)) {
            parsedItem[key] = isNaN(Number(value)) ? value : Number(value);
        }
        return parsedItem;
    });

    const processedData = options.type === "bar" || options.type === "pie"
        ? parsedChartData.slice(0, 20)
        : parsedChartData;

    const getColor = (key: string, index: number) => {
        options.colors?.map((color, index) => {
            console.log("color", color)
        })

        return options.colors?.[key] || defaultColors[index % defaultColors.length];
    };
    console.log(options)
    processedData.map((item, index) => {
        console.log("item", item)
        console.log("item", getColor(options.yKeys[0], index))
    })
    const renderChart = () => {
        switch (options.type) {
            case "bar":
                return (
                    <BarChart data={processedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={options.xKey}>
                            <Label value={toTitleCase(options.xKey)} offset={0} position="insideBottom" />
                        </XAxis>
                        <YAxis>
                            <Label value={toTitleCase(options.yKeys[0])} angle={-90} position="insideLeft" />
                        </YAxis>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {options.legend && <Legend />}
                        {options.yKeys.map((key, index) => (
                            <Bar key={key} dataKey={key} fill={getColor(key, index)} />
                        ))}
                    </BarChart>
                );

            case "line": {
                const { data, xAxisField, lineFields } = transformDataForMultiLineChart(processedData, options);
                const useTransformedData = options.multipleLines &&
                    options.measurementColumn &&
                    options.yKeys.includes(options.measurementColumn);

                return (
                    <LineChart data={useTransformedData ? data : processedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={options.xKey}>
                            <Label value={toTitleCase(useTransformedData ? xAxisField : options.xKey)} offset={0} position="insideBottom" />
                        </XAxis>
                        <YAxis>
                            <Label value={toTitleCase(options.yKeys[0])} angle={-90} position="insideLeft" />
                        </YAxis>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {options.legend && <Legend />}
                        {useTransformedData
                            ? lineFields.map((key, index) => (
                                <Line key={key} type="monotone" dataKey={key} stroke={getColor(key, index)} />
                            ))
                            : options.yKeys.map((key, index) => (
                                <Line key={key} type="monotone" dataKey={key} stroke={getColor(key, index)} />
                            ))}
                    </LineChart>
                );
            }

            case "area":
                return (
                    <AreaChart data={processedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={options.xKey} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {options.legend && <Legend />}
                        {options.yKeys.map((key, index) => (
                            <Area
                                key={key}
                                type="monotone"
                                dataKey={key}
                                fill={getColor(key, index)}
                                stroke={getColor(key, index)}
                            />
                        ))}
                    </AreaChart>
                );

            case "pie":
                return (
                    <PieChart>
                        <Pie
                            data={processedData}
                            dataKey={options.yKeys[0]}
                            nameKey={options.xKey}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                        >
                            {processedData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(options.yKeys[0], index)} />
                            ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {options.legend && <Legend />}
                    </PieChart>
                );

            default:
                return <div>Unsupported chart type: {options.type}</div>;
        }
    };

    return (
        <div className={cn("w-full flex flex-col justify-center items-center", className)}>
            <h2 className="text-lg font-bold mb-2">{options.title}</h2>
            {options && processedData.length > 0 && (
                <ChartContainer
                    config={options.yKeys.reduce(
                        (acc, key, index) => {
                            acc[key] = {
                                label: key,
                                color: getColor(key, index),
                            };
                            return acc;
                        },
                        {} as Record<string, { label: string; color: string }>,
                    )}
                    className="h-[320px] w-full chart-container"
                >
                    {renderChart()}
                </ChartContainer>
            )}
            <div className="w-full">
                <p className="mt-4 text-sm">{options.description}</p>
                <p className="mt-4 text-sm">{options.takeaway}</p>
            </div>
        </div>
    );
}

export const ChartResultComponent: Render = {
    content: (config: RenderConfig): React.ReactNode => {
        if (!config.chartConfig) {
            return null;
        }
        return (
            <ChartFactory
                config={config.chartConfig}
                className="w-full"
                chartData={config.data}
            />
        );
    },
    error: (config: RenderConfig): React.ReactNode => {
        return <div>Error: {config.errorMessage}</div>;
    },
    loading: (config: RenderConfig): React.ReactNode => {
        return <div>Loading...</div>;
    }
};
