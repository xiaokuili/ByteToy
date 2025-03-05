

import { useState, useCallback } from 'react';
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

interface UseDataFlowOptions {
    query?: string;
    dataSource?: DataSource;
    format?: DisplayFormat;
    onSuccess?: (config: RenderConfig) => void;
    onError?: (error: Error) => void;
}

interface UseDataFlowState {
    renderConfig: RenderConfig | null;
    isSelecting: boolean;
    isFetching: boolean;
    isConfiguring: boolean;
    error: Error | null;
}

export function useDataFlow(options: UseDataFlowOptions = {}) {
    const [state, setState] = useState<UseDataFlowState>({
        renderConfig: null,
        isSelecting: false,
        isFetching: false,
        isConfiguring: false,
        error: null
    });

    // 处理整个数据流程
    const processData = useCallback(async (query: string, dataSource?: DataSource, format: DisplayFormat = 'chart') => {
        if (!query.trim()) return;

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

        setState(prev => ({
            ...prev,
            renderConfig: initialConfig,
            isSelecting: true,
            error: null
        }));

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
            const configGenerator = ConfigGeneratorFactory.getGenerator(format);
            const finalConfig = await configGenerator(fetchResult.data, query, { id: flowId });

            // 4. 完成 - 返回最终的渲染配置
            setState(prev => ({
                ...prev,
                isConfiguring: false,
                renderConfig: {
                    ...finalConfig,
                    isLoading: false
                }
            }));

            // 调用成功回调
            if (options.onSuccess) {
                options.onSuccess(finalConfig);
            }

            return finalConfig;

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
        }
    }, [options.onSuccess, options.onError]);

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

    return {
        // 状态
        renderConfig: state.renderConfig,
        isLoading: state.isSelecting || state.isFetching || state.isConfiguring,
        isSelecting: state.isSelecting,
        isFetching: state.isFetching,
        isConfiguring: state.isConfiguring,
        error: state.error,

        // 方法
        processData,
        executeQuery,
        retry
    };
}


