"use server";

import { DataSource, DisplayFormat, FetchResult, RenderConfig } from "@/lib/types";
import { detectIntent } from "./intent";
import { select } from "./select";
import { FetchData } from "./fetch";
import { Generator } from "./configGenerator";
import { Message } from "ai";

// 用于缓存数据的Map
const dataCache = new Map<string, any>();



/**
 * 处理数据流程的核心逻辑
 * 
 * @param query 用户查询
 * @param dataSource 数据源
 * @param format 显示格式
 * @param flowId 流程ID
 * @param messages 对话历史
 * @param options 选项
 * @returns 处理结果
 */
export async function processDataFlow(
    query: string,
    dataSource: DataSource,
    format: DisplayFormat = 'chart',
    flowId: string,
    intentMessages: Message[] = [],
    chartMessages: Message[] = [],
    sqlMessages: Message[] = [],
): Promise<{
    result: RenderConfig;
    newSqlMessages: Message[];
    newChartMessages: Message[];
    newIntentMessages: Message[];
    sqlQuery?: string;
    intentType?: string;
}> {
    let newIntentMessages: Message[] = [];
    let newSqlMessages: Message[] = [];
    let newChartMessages: Message[] = [];
    try {
        // 1. 意图检测阶段
        const { intent, messages } = await detectIntent(query, intentMessages);
        newIntentMessages = [...intentMessages, ...(messages as Message[])];
        if (intent.intent === "no") {
            throw new Error("不属于数据可视化范围");
        }

        // 检查缓存中是否有数据，如果意图不是SQL相关，可以复用之前的数据
        const cacheKey = `${dataSource.name}_${query}`;
        let fetchResult: { result: FetchResult; messages?: Message[] };
        let intentType = intent;

        // 2. 选择和获取阶段
        if (intent.intent !== "sql" && !dataCache.has(cacheKey)) {
            // 需要获取新数据
            const fetchConfig = await select(dataSource, query);

            // 执行数据获取
            fetchResult = await FetchData(fetchConfig);
            newSqlMessages = [...sqlMessages, ...(fetchResult.messages as Message[])];

            // 缓存数据
            if (fetchResult.result.data && fetchResult.result.data.length > 0) {
                dataCache.set(cacheKey, fetchResult);
            }
        } else if (dataCache.has(cacheKey)) {
            // 使用缓存数据
            fetchResult = dataCache.get(cacheKey);
        } else {
            // 没有缓存且意图是图表配置，但没有数据可用
            throw new Error("需要先获取数据才能配置图表");
        }

        // 检查数据获取结果
        if (fetchResult.result.error) {
            throw new Error(fetchResult.result.error.message || '获取数据失败');
        }

        if (!fetchResult.result.data || fetchResult.result.data.length === 0) {
            throw new Error('没有返回数据');
        }

        // 3. 配置阶段 - 生成渲染配置
        const finalConfig = await Generator(fetchResult.result.data, query, chartMessages);
        newChartMessages = [...chartMessages, ...(finalConfig.messages as Message[])];
        // 将SQL查询添加到最终配置的元数据中
        const enhancedConfig: RenderConfig = {
            id: flowId,
            ...finalConfig,
            isLoading: false,
            metadata: {
                ...finalConfig.metadata,
                sqlQuery: fetchResult.result.metadata?.query,
                intentType: intent
            }
        };



        return {
            result: enhancedConfig,
            newSqlMessages: newSqlMessages,
            newChartMessages: newChartMessages,
            newIntentMessages: newIntentMessages,
            sqlQuery: fetchResult.result.metadata?.query,
            intentType: intent.intent
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
            newSqlMessages: sqlMessages,
            newChartMessages: chartMessages,
            newIntentMessages: intentMessages,
            intentType: "error"
        };
    }
}

/**
 * 清除数据缓存
 * @param dataSourceId 可选的数据源ID，如果提供则只清除该数据源的缓存
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
