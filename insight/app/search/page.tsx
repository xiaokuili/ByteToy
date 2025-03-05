"use client"
import { useState, useRef, useEffect } from "react";
import { Search, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { ChartConfig, RenderConfig } from "@/lib/types";
import { generateQuery, runGenerateSQLQuery, generateChartConfig } from "@/app/actions";
import { useSearchParams } from "next/navigation";
import SearchInput from "@/components/search/SearchInput";
import { FetchConfig } from "@/lib/types";
import { FetchData } from "@/actions/fetch";
import { testTableData } from "@/test/test-table-data";
import { SearchResultType, RenderSearchResult } from "@/components/search/index";
import { DisplayFormat } from "@/lib/types";
import { FetchResult } from "@/lib/types";

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
    const [resultType, setResultType] = useState<SearchResultType>(SearchResultType.CHART);

    useEffect(() => {
        const searchKey = `${query}_${model}_${format}_${source}`;
        if (query && !searchedQueriesRef.current.has(searchKey)) {
            searchedQueriesRef.current.add(searchKey);
            handleSearch(query);
        }
    }, [query, model, format, source]);

    const handleSearch = async (question: string) => {
        if (!question.trim()) return;

        setResultType(SearchResultType.CHART);

        const searchId = Date.now().toString();
        const newResult: RenderConfig = {
            id: searchId,
            query: question,
            format: 'chart' as DisplayFormat,
            chartConfig: {} as ChartConfig,
            data: [],
            isLoading: true
        };

        setSearchResults(prev => [newResult, ...prev]);

        try {
            const config: FetchConfig = {
                fetchType: "sql",
                query: question,
                dataSource: testTableData
            };

            const result = await FetchData(config);

            if (!result.data || result.error) {
                throw new Error(result.error?.message || "No data returned");
            }

            const generation = await generateChartConfig(result.data, question);
            const chartConfig = {
                options: generation.config
            };
            if (!result.data) {
                throw new Error("No data returned");
            }


            setSearchResults(prev =>
                prev.map(item =>
                    item.id === searchId
                        ? {
                            ...item,
                            chartConfig,
                            data: result.data || [],
                            isLoading: false
                        }
                        : item
                )
            );

        } catch (e) {
            console.error(e);
            toast.error("An error occurred. Please try again.");
            setSearchResults(prev =>
                prev.map(item =>
                    item.id === searchId
                        ? {
                            ...item,
                            isLoading: false,
                            format: format as DisplayFormat,
                            chartConfig: {} as ChartConfig,
                            data: []
                        }
                        : item
                )
            );
        }
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
            </div>
        </div>
    );
}