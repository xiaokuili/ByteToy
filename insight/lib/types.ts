import { z } from "zod";

//=============================================================================
// 完整数据处理流程
//=============================================================================

/**
 * 数据处理流程由五个主要步骤组成：
 * 1. 选择(Select) - 根据数据源类型选择合适的数据获取方法
 * 2. 获取(Fetch) - 从选定的数据源获取数据
 * 3. 配置(Configure) - 分析数据并生成适当的渲染配置
 * 4. 渲染(Render) - 将获取的数据以选定格式展示
 */

//=============================================================================
// 核心数据流类型
//=============================================================================

/** 数据源选择器 - 根据数据源和查询类型选择合适的获取方法 */
export type FetchSelector = (dataSource: DataSource, query: string) => FetchConfig;

/** 数据获取函数 - 从特定数据源获取数据 */
export type Fetch = (config: FetchConfig) => Promise<FetchResult>;


/** 配置生成器 - 为选定的展示格式生成配置 */
export type ConfigGenerator = (data: DataRecord[], query: string) => RenderConfig;

/** 数据渲染函数 - 接收配置并返回React组件 */
export type Render = ({ config }: { config: RenderConfig }) => React.ReactNode;


/** 数据记录类型 - 所有获取到的数据的基本格式 */
export type DataRecord = Record<string, string | number>;

/** 通用结果容器 */
export interface Result<T> {
    data?: T;                // 实际数据
    error?: {               // 可能的错误信息
        code: string;
        message: string;
        details?: any;
    };
    metadata?: Record<string, any>; // 元数据
}

/** 数据获取结果 */
export type FetchResult = Result<DataRecord[]>;


//=============================================================================
// 配置类型
//=============================================================================

/** 数据获取配置 */
export interface FetchConfig {
    fetchType: FetchType;   // 获取数据的方式
    query: string;          // 查询内容
    parameters?: Record<string, any>; // 额外参数
    dataSource?: DataSource; // 数据源
}

/** 渲染配置 */
export interface RenderConfig {
    id: string;
    data: DataRecord[];     // 要渲染的数据
    format: DisplayFormat;  // 展示格式
    chartConfig?: ChartConfig; // 图表配置（如果format为chart）
    tableConfig?: TableConfig; // 表格配置（如果format为table）
    searchConfig?: SearchConfig; // 搜索结果配置（如果format为search）
    query: string // 查询内容
    isLoading: boolean;
    error?: string;
}

/** 表格配置 */
export interface TableConfig {
    columns: Array<{
        key: string;
        title: string;
        width?: number;
    }>;
    pagination?: boolean;
}

/** 搜索结果配置 */
export interface SearchConfig {
    highlightFields: string[];
    showMetadata: boolean;
}

/** 数据源定义 */
export interface DataSource {
    name: string;           // 数据源名称
    description?: string;   // 数据源描述
    schema?: string;        // 建表语句
    example_data?: string;  // 样例数据
    special_fields?: string; // 特殊字段
    fetch_type?: FetchType; // 该数据源默认的获取方式
}

/** 数据获取类型 */
export type FetchType = "sql" | "rag" | "web";

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