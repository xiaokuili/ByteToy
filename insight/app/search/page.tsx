"use client"
import { useState, useRef, useEffect } from "react";
import { RenderConfig, DisplayFormat } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import SearchInput from "@/components/search/SearchInput";
import { RenderSearchResult } from "@/components/search/index";
import { Header } from "@/components/layout/Header";

import { useDataFlow } from "@/hook/useDataFlow";
import { useDataflowStorage } from "@/hook/useDataflowStorage";
import { testTableData } from "@/test/test-table-data";

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

export default function SearchPage() {
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const [searchResults, setSearchResults] = useState<RenderConfig[]>([]);

    const query = searchParams?.get('q') || '';
    const model = searchParams?.get('model') || 'DEEPSEEK';
    const format = searchParams?.get('format') || 'pie';
    const source = searchParams?.get('source') || '';
    const flowId = searchParams?.get('flowId') || '';

    const searchedQueriesRef = useRef<Set<string>>(new Set());

    const { saveDraft, createDataflow, drafts } = useDataflowStorage();

    const handleSearchSuccess = (config: RenderConfig) => {
        setSearchResults(prev => {
            const exists = prev.some(item => item.id === config.id);
            const newResults = exists
                ? prev.map(item => item.id === config.id ? config : item)
                : [config, ...prev];

            if (config.id && session?.user?.email) {
                saveDraft(config.id, {
                    id: config.id,
                    name: config.query,
                    datasourceId: testTableData.id as string,
                    sql: config.metadata?.sqlQuery,
                    chartType: config.format,
                    chartConfig: config.chartConfig?.options,
                    chartFramework: "recharts",
                    createdBy: session.user.email,
                    updatedBy: session.user.email,
                });
            }

            return newResults;
        });
    };

    const handleSearchError = (error: Error) => {
        const errorConfig: RenderConfig = {
            id: crypto.randomUUID(),
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
        
    } = useDataFlow({
        dataSource: testTableData,
        format: 'chart' as DisplayFormat,
        collectSQLQuery: true,
        onStart: (config) => setSearchResults(prev => [config, ...prev]),
        onSuccess: handleSearchSuccess,
        onError: handleSearchError
    });

    const handleSearch = async (question: string) => {
        if (!question.trim()) return;
        try {
            await executeQuery(flowId, question);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Search failed. Please try again.");
        }
    };

    const handleExport = async (configId: string) => {
        const draft = drafts[configId];
        if (!draft) {
            toast.error("Draft not found");
            return;
        }

        const toastId = "export-loading";
        try {
            toast.loading("Exporting to database...", { id: toastId });
            const result = await createDataflow(draft);
            
            toast.dismiss(toastId);
            if (result) {
                toast.success("Export successful", {
                    description: "Chart saved to database"
                });
            } else {
                throw new Error("Export failed");
            }
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("Export failed", {
                description: error instanceof Error ? error.message : "Unknown error"
            });
        }
    };

    useEffect(() => {
        const searchKey = `${query}_${model}_${format}_${source}`;
        if (query && !searchedQueriesRef.current.has(searchKey)) {
            searchedQueriesRef.current.add(searchKey);
            handleSearch(query);
        }
    }, );

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
            <Header variant="full" />
            
            <SearchInput
                onSearch={handleSearch}
                defaultModel={model}
                placeholder="Enter your question..."
            />

            <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
                <SearchResults results={searchResults} onExport={handleExport} />
                <SQLDebugger queries={sqlQueries} />
            </div>
        </div>
    );
}