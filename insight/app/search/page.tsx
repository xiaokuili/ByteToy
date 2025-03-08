"use client"
import { useState, useRef, useEffect } from "react";
import { Search, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { RenderConfig } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import SearchInput from "@/components/search/SearchInput";
import { testTableData } from "@/test/test-table-data";
import { RenderSearchResult } from "@/components/search/index";
import { DisplayFormat } from "@/lib/types";
import { useDataFlow } from "@/hook/useDataFlow";
import { toast } from "sonner";
import { useDataflowStorage } from "@/hook/useDataflowStorage";
import { Header } from "@/components/layout/Header";
import { useSession } from "next-auth/react";

export default function Page() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const model = searchParams.get('model') || 'DEEPSEEK';
    const format = searchParams.get('format') || 'pie';
    const source = searchParams.get('source') || '';

    const dataSource = testTableData;

    const { data: session } = useSession();

    const searchedQueriesRef = useRef<Set<string>>(new Set());
    const [searchResults, setSearchResults] = useState<RenderConfig[]>([]);
    const { saveDraft, removeDraft, createDataflow, drafts } = useDataflowStorage();

    // 使用 useDataFlow hook
    const {
        executeQuery,
        sqlQueries,
        intentMessages,
        sqlMessages,
        chartMessages
    } = useDataFlow({
        dataSource: dataSource,
        format: 'chart' as DisplayFormat,
        collectSQLQuery: true,
        onStart: (initialConfig) => {
            // 添加初始加载状态到搜索结果
            setSearchResults(prev => [initialConfig, ...prev]);
        },
        onSuccess: (config) => {
            // 成功获取数据后，将结果添加到搜索结果列表
            setSearchResults(prev => {
                // 检查是否已存在相同ID的结果，如果有则替换，否则添加到开头
                const exists = prev.some(item => item.id === config.id);
                const newResults = exists
                    ? prev.map(item => item.id === config.id ? config : item)
                    : [config, ...prev];

                // 保存草稿
                if (config.id) {
                    saveDraft(config.id, {
                        id: config.id,
                        name: config.query,
                        datasourceId: dataSource.id as string,
                        sql: config.metadata?.sqlQuery,
                        chartType: config.format,
                        chartConfig: config.chartConfig?.options,
                        chartFramework: "recharts",
                        createdBy: session?.user?.email || "user",
                        updatedBy: session?.user?.email || "user",
                    });
                }

                return newResults;
            });

        },
        onError: (error) => {
            setSearchResults(prev => {
                // 创建错误配置
                const errorConfig: RenderConfig = {
                    id: crypto.randomUUID(),
                    query: "",
                    format: "chart",
                    data: [],
                    isLoading: false,
                    isError: true,
                    errorMessage: error.message
                };

                // 检查是否已存在相同ID的结果
                const exists = prev.some(item => item.id === errorConfig.id);
                if (exists) {
                    return prev.map(item => item.id === errorConfig.id ? errorConfig : item);
                } else {
                    return [errorConfig, ...prev];
                }
            });
        }
    });

    const onExport = async (configId: string) => {
        // 基于useDataflowStorage 进行实现 存储到数据库中
        try {
            // 从drafts中获取对应的草稿数据
            const draft = drafts[configId];

            if (!draft) {
                toast.error("未找到草稿数据，请重试");
                return;
            }

            // 显示加载状态
            toast.loading("正在导出到数据库...", { id: "export-loading" });

            // 调用createDataflow将草稿保存到数据库
            const result = await createDataflow(draft);

            if (result) {
                toast.dismiss("export-loading");
                toast.success("导出成功", {
                    description: "图表已成功保存到数据库"
                });

                // 可选：导出成功后移除本地草稿
                // removeDraft(configId);
            } else {
                toast.dismiss("export-loading");
                toast.error("导出失败", {
                    description: "请稍后重试"
                });
            }
        } catch (error) {
            console.error("导出到数据库失败:", error);
            toast.dismiss("export-loading");
            toast.error("导出失败", {
                description: error instanceof Error ? error.message : "未知错误"
            });
        }
    }

    useEffect(() => {
        const searchKey = `${query}_${model}_${format}_${source}`;
        if (query && !searchedQueriesRef.current.has(searchKey)) {
            searchedQueriesRef.current.add(searchKey);
            handleSearch(query);
        }
    }, [query, model, format, source]);

    // 使用 useDataFlow 实现搜索处理
    const handleSearch = async (question: string) => {
        if (!question.trim()) return;
        try {
            // 使用 executeQuery 方法执行查询
            await executeQuery(question, intentMessages, sqlMessages, chartMessages);
        } catch (e) {
            console.error(e);
            toast.error("An error occurred. Please try again.");
        }
    };

    // SQL查询历史组件（可选，用于调试）
    const SQLHistoryDebug = () => {
        if (!sqlQueries.length) return null;

        return (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-medium mb-2">SQL查询历史</h3>
                <div className="space-y-2">
                    {sqlQueries.map((sql, index) => (
                        <div key={index} className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                            <pre className="text-xs overflow-x-auto">{sql}</pre>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
            <Header variant="full" />

            <SearchInput
                onSearch={handleSearch}
                defaultModel={model}
                placeholder="输入您的问题..."
            />

            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    {searchResults.map((result, index) => (
                        <RenderSearchResult
                            key={result.id || index}
                            format={result.format}
                            config={result}
                            onExport={() => result.id ? onExport(result.id) : toast.error("无法导出：缺少ID")}
                        />
                    ))}
                </div>

                {/* 可选：显示SQL查询历史（开发环境调试用） */}
                {/* TODO: 后续删除 */}
                {process.env.NODE_ENV === 'development' && <SQLHistoryDebug />}
            </div>
        </div>
    );
}