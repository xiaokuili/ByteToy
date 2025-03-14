"use client"
import { useState, useRef, useEffect, Suspense } from "react";
import { RenderConfig, DisplayFormat } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import SearchInput from "@/components/search/SearchInput";
import { RenderSearchResult } from "@/components/search/index";
import { Header } from "@/components/layout/Header";

import { useDataFlow } from "@/hook/useDataFlow";
import { useDatasource } from "@/hook/useDatasource";
import { DataSource } from "@/lib/types";
import { randomID } from "@/lib/utils";

interface SearchResultsProps {
    results: RenderConfig[];
    onExport: (configId: string) => Promise<void>;
}

const SearchResults = ({ results, onExport }: SearchResultsProps) => (
    
    <div className="space-y-8">
        {results.map((result, index) => (
            <RenderSearchResult
                key={`${result.id}-${index}`}
                format={result.format}
                config={result}
                onExport={() => result.id ? onExport(result.id) : toast.error("Missing ID for export")}
            />
        ))}
    </div>
);

const SQLDebugger = ({ queries }: { queries: string[] }) => {
    if (!queries.length || process.env.NODE_ENV !== 'development') return null;

    return (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium mb-2">SQL Query History</h3>
            <div className="space-y-2">
                {queries.map((sql, index) => (
                    <div key={index} className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                        <pre className="text-xs overflow-x-auto">{sql}</pre>
                    </div>
                ))}
            </div>
        </div>
    );
};

function SearchPageContent() {
    const searchParams = useSearchParams();
    const [searchResults, setSearchResults] = useState<RenderConfig[]>([]);
    const { getDatasourceFromLocalStorage } = useDatasource();
    
    const query = searchParams?.get('q') || '';
    const sourceName = searchParams?.get('source') || '';
    const flowId = searchParams?.get('flowId') || '';
    const dataSource = getDatasourceFromLocalStorage(sourceName);

    const searchedQueriesRef = useRef<Set<string>>(new Set());

    const handleSearchSuccess = (config: RenderConfig) => {
        setSearchResults(prev => {
            const exists = prev.some(item => item.id === config.id);
            const newResults = exists
                ? prev.map(item => item.id === config.id ? config : item)
                : [config, ...prev];

           console.log("newResults", newResults)
            
            return newResults;
        });
    };

    const handleSearchError = (error: Error) => {
        const errorConfig: RenderConfig = {
            id: randomID(),
            query: "",
            format: "chart",
            data: [],
            isLoading: false,
            isError: true,
            errorMessage: error.message
        };

        setSearchResults(prev => [errorConfig, ...prev]);
    };

    const {
        executeQuery,
        sqlQueries,
        isLoading
    } = useDataFlow({
        dataSource: dataSource as DataSource,
        format: 'chart' as DisplayFormat,
        collectSQLQuery: true,
        onStart: (config) => setSearchResults(prev => [config, ...prev]),
        onSuccess: handleSearchSuccess,
        onError: handleSearchError
    });

    const handleSearch = async (question: string) => {
        if (!question.trim()) return;
        const chatId = randomID();
        try {
            await executeQuery(flowId, question, chatId);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Search failed. Please try again.");
        }
    };

    const handleExport = async (configId: string) => {
        console.log("export", configId);
    };

    useEffect(() => {
        const searchKey = `${query}_${sourceName}`;
        if (query && !searchedQueriesRef.current.has(searchKey)) {
            searchedQueriesRef.current.add(searchKey);
            handleSearch(query);
        }
    }, [query, sourceName]);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
            <Header variant="full" />
            
            <SearchInput
                onSearch={handleSearch}
                placeholder="Enter your question..."
                isLoading={isLoading}
            />

            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
                <SearchResults results={searchResults} onExport={handleExport} />
                <SQLDebugger queries={sqlQueries} />
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}