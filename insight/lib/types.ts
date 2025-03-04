import { z } from "zod";

export interface DataSource {
    name: string;           // 数据源名称
    description?: string;    // 数据源描述
    schema?: string;         // 建表语句
    example_data?: string;   // 样例数据
    special_fields?: string; // 特殊字段， group by 获取
}


//定义数据库查询结果类型
export type DBResult = Record<string, string | number>;


// 定义图标配置类型
export const configSchema = z
    .object({
        description: z
            .string()
            .describe(
                "Describe the chart. What is it showing? What is interesting about the way the data is displayed?",
            ),
        takeaway: z.string().describe("What is the main takeaway from the chart?"),
        type: z.enum(["bar", "line", "area", "pie"]).describe("Type of chart"),
        title: z.string(),
        xKey: z.string().describe("Key for x-axis or category"),
        yKeys: z.array(z.string()).describe("Key(s) for y-axis values this is typically the quantitative column"),
        multipleLines: z.boolean().describe("For line charts only: whether the chart is comparing groups of data.").optional(),
        measurementColumn: z.string().describe("For line charts only: key for quantitative y-axis column to measure against (eg. values, counts etc.)").optional(),
        lineCategories: z.array(z.string()).describe("For line charts only: Categories used to compare different lines or data series. Each category represents a distinct line in the chart.").optional(),
        colors: z
            .record(
                z.string().describe("Any of the yKeys"),
                z.string().describe("Color value in CSS format (e.g., hex, rgb, hsl)"),
            )
            .describe("Mapping of data keys to color values for chart elements")
            .optional(),
        legend: z.boolean().describe("Whether to show legend"),
    })
    .describe("Chart configuration object");


export type Config = z.infer<typeof configSchema>;


// 完整图表配置
export interface ChartConfig {
    chartData: DBResult[];
    options?: Config;
} 