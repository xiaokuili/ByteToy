"use server";

import { DataRecord, DataSource, DisplayFormat, FetchResult, RenderConfig } from "@/lib/types";
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
    console.log("API Key :", process.env.NEXT_PUBLIC_API_KEY);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`},
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`},
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
    chatId: string
): Promise<{
    result: RenderConfig;
    sqlQuery?: string;
    intentType?: string;
}> {
    try {
        // 1. 获取数据
        let fetchResult: { result: FetchResult } = { result: { data: [] } };
        const sqlQuery = await fetchSQLQuery(query, dataSource, flowId);
        console.log("sqlQuery", sqlQuery);

        const cacheKey = `${flowId}_${sqlQuery}`;

        if (dataCache.has(cacheKey)) {
            fetchResult = dataCache.get(cacheKey) as { result: FetchResult };
        } else {
            const result = await RunGenerateSQLQuery(sqlQuery);
            fetchResult = { result: { data: result } };
            dataCache.set(cacheKey, fetchResult);
        }

        // 2.获取配置
        const config = await fetchChartConfig(query, fetchResult.result.data as DataRecord[], flowId);
        
        const finalConfig: RenderConfig = {
            id: chatId,
            query: query,
            data: fetchResult.result.data as DataRecord[],
            chartConfig: {
                options: config.config
            },
            format: format,
            isLoading: false,
            metadata: {
                ...config.metadata,
                sqlQuery: fetchResult.result.metadata?.query,
            }
        };

        return {
            result: finalConfig,
            sqlQuery: fetchResult.result.metadata?.query as string,
        };
    } catch (error) {
        const err = error instanceof Error ? error : new Error('处理数据时发生未知错误');

        // 创建错误配置
        const errorConfig: RenderConfig = {
            id: chatId,
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
