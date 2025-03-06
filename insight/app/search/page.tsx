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

// Simple toast replacement
const toast = {
    error: (message: string) => {
        console.error(message);
        alert(message);
    }
};

export default function Page() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const model = searchParams.get('model') || 'DEEPSEEK';
    const format = searchParams.get('format') || 'pie';
    const source = searchParams.get('source') || '';

    const searchedQueriesRef = useRef<Set<string>>(new Set());
    const [searchResults, setSearchResults] = useState<RenderConfig[]>([]);

    // 使用 useDataFlow hook
    const {

        executeQuery,
        sqlQueries
    } = useDataFlow({
        dataSource: testTableData,
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
                if (exists) {
                    return prev.map(item => item.id === config.id ? config : item);
                } else {
                    return [config, ...prev];
                }
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
            await executeQuery(question);
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
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <Link href="/" className="flex items-center">
                            <div className="relative w-10 h-10 mr-3">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-80"></div>
                                <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">BT</span>
                                </div>
                            </div>
                            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                ByteToy Insight
                            </h1>
                        </Link>
                    </div>
                </div>
            </header>

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