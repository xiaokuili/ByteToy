import { useState, useCallback, useRef } from 'react';
import {
    RenderConfig,
    DisplayFormat,
    DataSource,
} from '@/lib/types';
import { Message } from 'ai';
import { processDataFlow, clearDataCache } from '@/actions/dataflow';

interface UseDataFlowOptions {
    query?: string;
    dataSource?: DataSource;
    format?: DisplayFormat;
    onStart?: (initialConfig: RenderConfig) => void; // 添加onStart回调
    onSuccess?: (config: RenderConfig) => void;
    onError?: (error: Error) => void;
    collectSQLQuery?: boolean; // 是否收集SQL语句
}

interface UseDataFlowState {
    renderConfig: RenderConfig | null;
    isSelecting: boolean;
    isFetching: boolean;
    isConfiguring: boolean;
    error: Error | null;
    sqlQueries: string[]; // 存储SQL查询语句
    intentMessages: Message[]; // 存储多轮对话记录
    sqlMessages: Message[]; // 存储多轮对话记录
    chartMessages: Message[]; // 存储多轮对话记录
}

export function useDataFlow(options: UseDataFlowOptions = {}) {
    const [state, setState] = useState<UseDataFlowState>({
        renderConfig: null,
        isSelecting: false,
        isFetching: false,
        isConfiguring: false,
        error: null,
        sqlQueries: [], // 初始化为空数组
        intentMessages: [],
        sqlMessages: [],
        chartMessages: []
    });
    // 使用 ref 跟踪正在进行的查询
    const pendingQueriesRef = useRef<Map<string, Promise<RenderConfig | null>>>(new Map());

    // 处理整个数据流程
    const processData = useCallback(async (query: string, dataSource?: DataSource, format: DisplayFormat = 'chart', intentMessage?: Message[], sqlMessage?: Message[], chartMessage?: Message[]) => {
        if (!query.trim()) return null;

        // 创建查询键
        const queryKey = `${query}_${format}`;

        // 如果相同的查询正在进行中，则返回现有的 Promise
        if (pendingQueriesRef.current.has(queryKey)) {
            return pendingQueriesRef.current.get(queryKey);
        }

        // 创建唯一ID
        const flowId = crypto.randomUUID();

        // 初始化渲染配置（加载状态）
        const initialConfig: RenderConfig = {
            id: flowId,
            query,
            format,
            data: [],
            isLoading: true,
            loadingMessage: '正在处理您的查询...'
        };

        // 调用onStart回调，传递初始配置
        if (options.onStart) {
            options.onStart(initialConfig);
        }

        setState(prev => ({
            ...prev,
            renderConfig: initialConfig,
            isSelecting: true,
            error: null
        }));

        // 创建处理 Promise 并存储
        const processingPromise = (async () => {
            try {
                // 更新状态为选择阶段
                setState(prev => ({
                    ...prev,
                    isSelecting: true,
                    renderConfig: {
                        ...prev.renderConfig!,
                        loadingMessage: '正在分析查询...'
                    }
                }));

                // 调用服务端处理函数
                const { result: intentResult, intentType, newSqlMessages, newChartMessages, newIntentMessages } = await processDataFlow(
                    query,
                    dataSource as DataSource,
                    format,
                    flowId,
                    intentMessage || state.intentMessages,
                    sqlMessage || state.sqlMessages,
                    chartMessage || state.chartMessages,

                );

                // 根据意图类型更新状态
                if (intentType != "sql") {
                    // 直接进入配置阶段
                    setState(prev => ({
                        ...prev,
                        isSelecting: false,
                        isFetching: false,
                        isConfiguring: true,
                        renderConfig: {
                            ...prev.renderConfig!,
                            loadingMessage: '正在生成可视化配置...'
                        }
                    }));
                } else {
                    // 正常流程：选择 -> 获取 -> 配置
                    setState(prev => ({
                        ...prev,
                        isSelecting: false,
                        isFetching: true,
                        renderConfig: {
                            ...prev.renderConfig!,
                            loadingMessage: '正在获取数据...'
                        }
                    }));

                    // 模拟获取阶段完成
                    setTimeout(() => {
                        setState(prev => ({
                            ...prev,
                            isFetching: false,
                            isConfiguring: true,
                            renderConfig: {
                                ...prev.renderConfig!,
                                loadingMessage: '正在生成可视化配置...'
                            }
                        }));
                    }, 500);
                }

                // 收集SQL查询（如果有）
                if (options.collectSQLQuery && intentResult.metadata?.sqlQuery) {
                    setState(prev => ({
                        ...prev,
                        sqlQueries: [...prev.sqlQueries, intentResult.metadata?.sqlQuery as string]
                    }));
                }

                // 最终更新状态
                setState(prev => ({
                    ...prev,
                    isSelecting: false,
                    isFetching: false,
                    isConfiguring: false,
                    renderConfig: intentResult,
                    intentMessages: newIntentMessages,
                    sqlMessages: newSqlMessages,
                    chartMessages: newChartMessages
                }));
                if (options.onSuccess) {
                    options.onSuccess(intentResult);
                }
                return intentResult;
            } catch (e) {
                const error = e instanceof Error ? e : new Error('处理数据时发生未知错误');
                console.error(error);

                // 更新为错误状态
                const errorConfig: RenderConfig = {
                    id: flowId,
                    query,
                    format,
                    data: [],
                    isLoading: false,
                    isError: true,
                    errorMessage: error.message
                };

                setState(prev => ({
                    ...prev,
                    isSelecting: false,
                    isFetching: false,
                    isConfiguring: false,
                    renderConfig: errorConfig,
                    error,
                    intentMessages: state.intentMessages,
                    sqlMessages: state.sqlMessages,
                    chartMessages: state.chartMessages
                }));

                // 调用错误回调
                if (options.onError) {
                    options.onError(error);
                }

                return errorConfig;
            } finally {
                // 无论成功还是失败，都从正在进行的查询中移除
                pendingQueriesRef.current.delete(queryKey);
            }
        })();

        // 存储 Promise
        pendingQueriesRef.current.set(queryKey, processingPromise);

        return processingPromise;
    }, [options.onStart, options.onSuccess, options.onError, options.collectSQLQuery, state.sqlMessages, state.chartMessages]);

    // 执行查询的便捷方法
    const executeQuery = useCallback((query: string, intentMessages?: Message[], sqlMessages?: Message[], chartMessages?: Message[]) => {
        console.log("sqlMessages", sqlMessages);
        console.log("chartMessages", chartMessages);
        console.log("intentMessages", intentMessages);
        return processData(query, options.dataSource, options.format, sqlMessages, chartMessages);
    }, [processData, options.dataSource, options.format]);

    // 重试当前查询
    const retry = useCallback(() => {
        if (state.renderConfig?.query) {
            return processData(
                state.renderConfig.query,
                options.dataSource,
                state.renderConfig.format
            );
        }
    }, [processData, state.renderConfig, options.dataSource]);

    // 清除SQL查询历史
    const clearSQLQueries = useCallback(() => {
        setState(prev => ({
            ...prev,
            sqlQueries: []
        }));
    }, []);

    // 清除数据缓存
    const clearCache = useCallback((dataSourceId?: string) => {
        clearDataCache(dataSourceId);
    }, []);

    return {
        // 状态
        renderConfig: state.renderConfig,
        isLoading: state.isSelecting || state.isFetching || state.isConfiguring,
        isSelecting: state.isSelecting,
        isFetching: state.isFetching,
        isConfiguring: state.isConfiguring,
        error: state.error,
        sqlQueries: state.sqlQueries, // 暴露SQL查询历史
        sqlMessages: state.sqlMessages,
        chartMessages: state.chartMessages,
        intentMessages: state.intentMessages,
        // 方法
        processData,
        executeQuery,
        retry,
        clearSQLQueries, // 提供清除SQL查询历史的方法
        clearCache // 提供清除数据缓存的方法
    };
}


