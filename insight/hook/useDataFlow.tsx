import { useState, useCallback, useRef } from 'react';
import {
    DataRecord,
    RenderConfig,
    FetchConfig,
    DisplayFormat,
    DataSource,
    FetchResult
} from '@/lib/types';
import { FetchData } from '@/actions/fetch';
import { ConfigGeneratorFactory } from '@/actions/configGenerator';
import { select } from '@/actions/select';
import { testTableData } from '@/test/test-table-data';

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
}

export function useDataFlow(options: UseDataFlowOptions = {}) {
    const [state, setState] = useState<UseDataFlowState>({
        renderConfig: null,
        isSelecting: false,
        isFetching: false,
        isConfiguring: false,
        error: null,
        sqlQueries: [] // 初始化为空数组
    });

    // 使用 ref 跟踪正在进行的查询
    const pendingQueriesRef = useRef<Map<string, Promise<RenderConfig | null>>>(new Map());

    // 处理整个数据流程
    const processData = useCallback(async (query: string, dataSource?: DataSource, format: DisplayFormat = 'chart') => {
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
                // 1. 选择阶段 - 选择合适的数据获取方法
                const fetchConfig = await select(dataSource as DataSource, query);

                setState(prev => ({
                    ...prev,
                    isSelecting: false,
                    isFetching: true,
                    renderConfig: {
                        ...prev.renderConfig!,
                        loadingMessage: '正在获取数据...'
                    }
                }));

                // 2. 获取阶段 - 从数据源获取数据
                const fetchResult: FetchResult = await FetchData(fetchConfig);

                // 收集SQL语句（如果存在且启用了收集）
                if (options.collectSQLQuery && fetchResult.metadata?.query) {
                    const sqlQuery = fetchResult.metadata.query;
                    setState(prev => ({
                        ...prev,
                        sqlQueries: [...prev.sqlQueries, sqlQuery]
                    }));
                }

                if (fetchResult.error) {
                    throw new Error(fetchResult.error.message || '获取数据失败');
                }

                if (!fetchResult.data || fetchResult.data.length === 0) {
                    throw new Error('没有返回数据');
                }

                setState(prev => ({
                    ...prev,
                    isFetching: false,
                    isConfiguring: true,
                    renderConfig: {
                        ...prev.renderConfig!,
                        loadingMessage: '正在生成可视化配置...'
                    }
                }));

                // 3. 配置阶段 - 生成渲染配置
                const configGenerator = ConfigGeneratorFactory(format);
                const finalConfig = await configGenerator(fetchResult.data, query);

                // 将SQL查询添加到最终配置的元数据中
                const enhancedConfig: RenderConfig = {
                    ...finalConfig,
                    isLoading: false,
                    metadata: {
                        ...finalConfig.metadata,
                        sqlQuery: fetchResult.metadata?.query
                    }
                };

                // 4. 完成 - 返回最终的渲染配置
                setState(prev => ({
                    ...prev,
                    isConfiguring: false,
                    renderConfig: enhancedConfig
                }));

                // 调用成功回调
                if (options.onSuccess) {
                    options.onSuccess(enhancedConfig);
                }

                return enhancedConfig;
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
                    error
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
    }, [options.onStart, options.onSuccess, options.onError, options.collectSQLQuery]);

    // 执行查询的便捷方法
    const executeQuery = useCallback((query: string) => {
        return processData(query, options.dataSource, options.format);
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

    return {
        // 状态
        renderConfig: state.renderConfig,
        isLoading: state.isSelecting || state.isFetching || state.isConfiguring,
        isSelecting: state.isSelecting,
        isFetching: state.isFetching,
        isConfiguring: state.isConfiguring,
        error: state.error,
        sqlQueries: state.sqlQueries, // 暴露SQL查询历史

        // 方法
        processData,
        executeQuery,
        retry,
        clearSQLQueries // 提供清除SQL查询历史的方法
    };
}


