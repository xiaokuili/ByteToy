import { Message } from "ai";
import { z } from "zod";



/** 数据渲染函数 - 接收配置并返回React组件 */
export interface Render {
    content: (config: RenderConfig) => React.ReactNode;
    error: (config: RenderConfig) => React.ReactNode;
    loading: (config: RenderConfig) => React.ReactNode;
}



/** 数据记录类型 - 所有获取到的数据的基本格式 */
export type DataRecord = Record<string, string | number>;

/** 通用结果容器 */
export interface Result<T> {
    data?: T;                // 实际数据
    error?: {               // 可能的错误信息
        code: string;
        message: string;
        details?: unknown;
    };
    metadata?: Record<string, unknown>; // 元数据
}

/** 数据获取结果 */
export type FetchResult = Result<DataRecord[]>;


//=============================================================================
// 配置类型
//=============================================================================





/** 渲染配置 */
export interface RenderConfig {
    id?: string; // 第一次创建是生成，后续不生成 
    query?: string // 查询内容

    data: DataRecord[];     // 要渲染的数据
    format: DisplayFormat;  // 展示格式
    chartConfig?: ChartConfig; // 图表配置（如果format为chart）
    
    // loading 
    isLoading?: boolean;
    loadingMessage?: string;
    // error 
    isError?: boolean;
    errorMessage?: string;

    // 元数据 
    metadata?: Record<string,unknown>;
    messages?: Message[]; // 多轮对话记录
}


/** 数据源定义 */

export interface DataSource {
    id: string;
    name: string;
    description: string;
    schema: string;
    example_data: string;
    special_fields: string;

}

/** 数据展示格式 */
export type DisplayFormat = "chart" | "table" | "search";

//=============================================================================
// 图表配置 (次要)
//=============================================================================

/** 图表配置 */
export interface ChartConfig {
    options?: Config;
}

/** 图表配置类型 */
export type Config = z.infer<typeof configSchema>;

/** 图表配置模式验证 */
export const configSchema = z
    .object({
        description: z
            .string()
            .describe(
                "Describe the chart. What is it showing? What is interesting about the way the data is displayed?",
            ),
        takeaway: z.string().describe("What is the main takeaway from the chart?"),
        type: z.enum(["bar", "line", "area", "pie", "scatter", "radar", "radialBar", "composed"]).describe("Type of chart"),
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



export type Intent = "美化图表" | "生成图表"
