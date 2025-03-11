import { useState, useCallback, useRef } from 'react';
import {
    RenderConfig,
    DisplayFormat,
    DataSource,
} from '@/lib/types';
import { processDataFlow, clearDataCache } from '@/actions/dataflow';

interface UseDataFlowOptions {
    flowId?: string;
    chatId?: string;
    query?: string;
    dataSource?: DataSource;
    format?: DisplayFormat;
    onStart?: (initialConfig: RenderConfig) => void;
    onSuccess?: (config: RenderConfig) => void;
    onError?: (error: Error) => void;
    collectSQLQuery?: boolean;
}

interface UseDataFlowState {
    renderConfig: RenderConfig | null;
    isLoading: boolean;
    error: Error | null;
    sqlQueries: string[];
}

export function useDataFlow(options: UseDataFlowOptions = {}) {
    const [state, setState] = useState<UseDataFlowState>({
        renderConfig: null,
        isLoading: false,
        error: null,
        sqlQueries: []
    });
    
    const pendingQueriesRef = useRef<Map<string, Promise<RenderConfig | null>>>(new Map());

    const processData = useCallback(async (
        flowId: string, 
        chatId: string,
        query: string, 
        dataSource?: DataSource, 
        format: DisplayFormat = 'chart'
    ) => {
        if (!query.trim()) return null;

        const queryKey = `${query}_${format}`;
        if (pendingQueriesRef.current.has(queryKey)) {
            return pendingQueriesRef.current.get(queryKey);
        }

        const initialConfig: RenderConfig = {
            id: chatId,
            query,
            format,
            data: [],
            isLoading: true,
            loadingMessage: 'Processing your query...'
        };

        options.onStart?.(initialConfig);
        setState(prev => ({ ...prev, renderConfig: initialConfig, isLoading: true, error: null }));

        const processingPromise = (async () => {
            try {
                const { result } = await processDataFlow(query, dataSource as DataSource, "chart", flowId, chatId);

                if (options.collectSQLQuery && result.metadata?.sqlQuery) {
                    setState(prev => ({
                        ...prev,
                        sqlQueries: [...prev.sqlQueries, result.metadata?.sqlQuery as string]
                    }));
                }

                setState(prev => ({ ...prev, isLoading: false }));
                // 设置结果的id
                options.onSuccess?.(result);
                return result;
            } catch (e) {
                const error = e instanceof Error ? e : new Error('Unknown error during data processing');
                console.error(error);

                const errorConfig: RenderConfig = {
                    id: chatId,
                    query,
                    format,
                    data: [],
                    isLoading: false,
                    isError: true,
                    errorMessage: error.message
                };

                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    renderConfig: errorConfig,
                    error
                }));

                options.onError?.(error);
                return errorConfig;
            } finally {
                pendingQueriesRef.current.delete(queryKey);
            }
        })();

        pendingQueriesRef.current.set(queryKey, processingPromise);
        return processingPromise;
    }, [options]);

    const executeQuery = useCallback((flowId: string, query: string, chatId: string) => {
        return processData(flowId, chatId, query, options.dataSource, options.format);
    }, [processData, options.dataSource, options.format]);



    const clearSQLQueries = useCallback(() => {
        setState(prev => ({ ...prev, sqlQueries: [] }));
    }, []);

    return {
        renderConfig: state.renderConfig,
        isLoading: state.isLoading,
        error: state.error,
        sqlQueries: state.sqlQueries,

        processData,
        executeQuery,
        clearSQLQueries,
        clearCache: clearDataCache
    };
}


