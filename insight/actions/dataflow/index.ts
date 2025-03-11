"use server";

import { DataRecord, DataSource, DisplayFormat, FetchResult, RenderConfig } from "@/lib/types";
import { detectIntent } from "./intent";
import {  createConnection } from "@/lib/db";

// Cache for storing query results
const dataCache = new Map<string, { result: FetchResult }>();






/**
 * 执行SQL查询
 * @param query SQL查询语句
 * @returns 查询结果数据
 */
export const RunGenerateSQLQuery = async (query: string) => {
    "use server";
    // 安全检查：仅允许SELECT语句
    const normalizedQuery = query.toLowerCase().trim();
    console.log(normalizedQuery);
    
    if (
        !normalizedQuery.startsWith("select") ||
        normalizedQuery.includes("delete") ||
        normalizedQuery.includes("insert") ||
        normalizedQuery.includes("update") ||
        normalizedQuery.includes("alter") ||
        normalizedQuery.includes("truncate") ||
        normalizedQuery.includes("grant") ||
        normalizedQuery.includes("revoke")
    ) {
        throw new Error("Only SELECT queries are allowed");
    }

    let data: {
        rows: DataRecord[];
        
    };

    // TODO:目前仅支持一个源，后续需要支持多个源
    const db = createConnection();
    try {
        data = await db.execute(normalizedQuery);
    } catch (e: unknown) {
        if (e instanceof Error && e.message.includes('relation "unicorns" does not exist')) {
            console.log(
                "Table does not exist, creating and seeding it with dummy data now...",
            );
            // throw error 
            throw Error("Table does not exist");
        } else {
            throw e;
        }
    }

    return data.rows as DataRecord[];
};

/**
 * 从API获取SQL查询结果
 */
async function fetchSQLQuery(query: string, dataSource: DataSource, flowId: string): Promise<string> {
    const response = await fetch('http://127.0.0.1:8000/generate/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: query, datasource: dataSource, session_id: flowId })
    });

    if (!response.ok) {
        throw new Error(`SQL generation failed: ${await response.text()}`);
    }

    const result = await response.json();
    return result.sql.query;
}

/**
 * 从API获取图表配置
 */
async function fetchChartConfig(query: string, data: DataRecord[], flowId: string) {
    const response = await fetch('http://127.0.0.1:8000/generate/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: query, data, session_id: flowId })
    });

    if (!response.ok) {
        throw new Error(`Chart config generation failed: ${await response.text()}`);
    }

    return (await response.json()).chart_config;
}

/**
 * 处理数据流程的核心逻辑
 */
export async function processDataFlow(
    query: string,
    dataSource: DataSource,
    format: DisplayFormat = 'chart',
    flowId: string,
): Promise<{
    result: RenderConfig;
    sqlQuery?: string;
    intentType?: string;
}> {
    try {
        // 1. 意图检测阶段
        const { intent } = await detectIntent(query);

        // 检查缓存中是否有数据
        const cacheKey = `${dataSource.name}_${flowId}`;

        // 2. 选择和获取阶段
        let fetchResult: { result: FetchResult } = { result: { data: [] } };

        if (intent === "生成图表" && !dataCache.has(cacheKey)) {
            // 获取SQL查询
            const sqlQuery = await fetchSQLQuery(query, dataSource, flowId);
            const result = await RunGenerateSQLQuery(sqlQuery);
            
            if (result?.length > 0) {
                fetchResult = { result: { data: result } };
                dataCache.set(cacheKey, fetchResult);
            }
        } else if (dataCache.has(cacheKey)) {
            // 使用缓存数据
            const cachedResult = dataCache.get(cacheKey);
            if (!cachedResult) {
                throw new Error("缓存数据不存在");
            }
            fetchResult = cachedResult;
        } else {
            throw new Error("需要先获取数据才能配置图表");
        }

        // 3. 配置阶段 - 获取图表配置
        const finalConfig = await fetchChartConfig(query, fetchResult.result.data as DataRecord[], flowId);
        // 构建增强配置
        const enhancedConfig: RenderConfig = {
            id: flowId,
            data: fetchResult.result.data as DataRecord[],
            chartConfig: {
                options: finalConfig.config
            },
            format: format,
            isLoading: false,
            metadata: {
                ...finalConfig.metadata,
                sqlQuery: fetchResult.result.metadata?.query,
                intentType: intent
            }
        };

        return {
            result: enhancedConfig,
            sqlQuery: fetchResult.result.metadata?.query as string,
            intentType: intent
        };
    } catch (error) {
        const err = error instanceof Error ? error : new Error('处理数据时发生未知错误');

        // 创建错误配置
        const errorConfig: RenderConfig = {
            id: flowId,
            query,
            format,
            data: [],
            isLoading: false,
            isError: true,
            errorMessage: err.message
        };

        return {
            result: errorConfig,
            intentType: "error"
        };
    }
}

/**
 * 清除数据缓存
 */
export async function clearDataCache(dataSourceId?: string) {
    if (dataSourceId) {
        // 清除特定数据源的缓存
        for (const key of dataCache.keys()) {
            if (key.startsWith(`${dataSourceId}_`)) {
                dataCache.delete(key);
            }
        }
    } else {
        // 清除所有缓存
        dataCache.clear();
    }
}
