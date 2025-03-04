"use client"
import { useState, useRef, useEffect } from "react";
import { Search, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { ChartConfig } from "@/lib/types";
import SearchResult from "@/components/search/SearchResult";
import { DisplayFormat } from "@/config/filters";
import { generateQuery, runGenerateSQLQuery, generateChartConfig } from "@/app/actions";
import { useSearchParams } from "next/navigation";
import { DataSource } from "@/lib/types";
import SearchInput from "@/components/search/SearchInput";
import { testTableData } from "@/test/test-table-data";

interface SearchResultProps {
    id: string;
    query: string;
    isLoading: boolean;
    format: DisplayFormat;
    chartConfig: ChartConfig;
}

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
    const [searchResults, setSearchResults] = useState<SearchResultProps[]>([]);

    // URL参数变化时执行搜索
    useEffect(() => {
        const searchKey = `${query}_${model}_${format}_${source}`;
        if (query && !searchedQueriesRef.current.has(searchKey)) {
            searchedQueriesRef.current.add(searchKey);
            handleSearch(query);
        }
    }, [query, model, format, source]);

    const handleSearch = async (question: string) => {
        if (!question.trim()) return;

        // 生成搜索ID
        const searchId = Date.now().toString();

        // 创建新的搜索结果
        const newResult = {
            id: searchId,
            query: question,
            isLoading: true,
            format: 'list' as DisplayFormat,
            chartConfig: {} as ChartConfig
        };

        setSearchResults(prev => [newResult, ...prev]);

        try {
            // Step 1: Generate SQL query from natural language
            // TODO: 后续处理datasource逻辑
            const datasource = testTableData;
            const sqlQuery = await generateQuery(question, datasource);
            console.log("sqlQuery", sqlQuery);
            if (sqlQuery === undefined) {
                toast.error("An error occurred. Please try again.");
                return;
            }

            // Step 2: Execute the SQL query
            const data = await runGenerateSQLQuery(sqlQuery);
            const columns = data.length > 0 ? Object.keys(data[0]) : [];
            console.log("data", data);
            // Step 3: Generate chart configuration
            const generation = await generateChartConfig(data, question);
            const chartConfig = {
                chartData: data,
                options: generation.config
            };

            // Update search results
            setSearchResults(prev =>
                prev.map(result => {
                    if (result.id === searchId) {
                        return {
                            ...result,
                            isLoading: false,
                            format: format as DisplayFormat,
                            chartConfig
                        };
                    }
                    return result;
                })
            );

        } catch (e) {
            console.error(e);
            toast.error("An error occurred. Please try again.");
            setSearchResults(prev =>
                prev.map(result => {
                    if (result.id === searchId) {
                        return {
                            ...result,
                            isLoading: false,
                            format: 'list' as DisplayFormat,
                            chartConfig: {} as ChartConfig
                        };
                    }
                    return result;
                })
            );
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-40 w-80 h-80 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Header navigation */}
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <div className="relative w-10 h-10 mr-3">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-80"></div>
                                    <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">BT</span>
                                    </div>
                                </div>
                                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                    ByteToy Insight
                                </h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Floating search input */}
            <SearchInput
                onSearch={handleSearch}
                defaultModel={model}
                placeholder="输入您的问题..."
            />

            {/* Search history and results area */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 pb-24 overflow-y-auto relative z-10">
                <div className="space-y-8">
                    {searchResults.map((result, index) => {
                        const props = {
                            id: result.id,
                            query: result.query,
                            isLoading: result.isLoading,
                            format: result.format,
                            chartConfig: result.chartConfig
                        };
                        return <SearchResult key={result.id || index} {...props} />;
                    })}
                </div>
            </div>
        </div>
    );
}