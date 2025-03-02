"use client"

import { useState, useEffect } from "react"
import { FileUploadToggle } from "@/components/ui/file-upload-toggle"
import { DataSourceFilter } from "@/components/filters/DataSourceFilter"
import { DisplayFormatFilter } from "@/components/filters/DisplayFormatFilter"
import { SearchResults } from "@/components/search/SearchResults"
import { useSearchParams } from "next/navigation"
import { DataSource, DisplayFormat, AIModel } from "@/config/filters";
import { SearchInput } from "@/components/search/SearchInput";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const model = (searchParams.get("model") as AIModel) || "GPT-4";
    const format = (searchParams.get("format") as DisplayFormat) || "列表";
    const source = searchParams.get("source") as DataSource || null;

    const [searchQuery, setSearchQuery] = useState(query);
    const [isLoading, setIsLoading] = useState(true);
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        // 模拟搜索结果加载
        const timer = setTimeout(() => {
            setResults([
                { id: 1, title: "搜索结果 1", content: "这是搜索结果的内容..." },
                { id: 2, title: "搜索结果 2", content: "这是搜索结果的内容..." },
                { id: 3, title: "搜索结果 3", content: "这是搜索结果的内容..." },
            ]);
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [query, model, format, source]);

    const handleSearch = () => {
        // 实现搜索逻辑
        console.log("Searching for:", searchQuery);
    };

    const handleFileUpload = (file: File) => {
        console.log("File uploaded:", file);
    };

    return (
        <main className="min-h-screen w-full">
            <div className="container mx-auto px-4 py-6">
                {/* 搜索栏 */}
                <div className="mb-8">
                    {/* <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        selectedModel={model}
                        onModelClick={() => { }}
                        onDataSourceClick={() => { }}
                        onDisplayFormatClick={() => { }}
                        onFileUpload={handleFileUpload}
                        onSearch={handleSearch}
                        hasDataSourceSettings={source !== null}
                        onSearchResultClick={() => closeAllPanels()}
                        dataSourceName={source || "百度"}
                        displayFormatName={format}
                    /> */}
                </div>

                {/* 搜索结果 */}
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-xl font-medium text-slate-800">搜索结果</h2>
                            <div className="space-y-4">
                                {results.map((result) => (
                                    <div
                                        key={result.id}
                                        className="card"
                                    >
                                        <h3 className="text-lg font-medium text-slate-800 mb-2">{result.title}</h3>
                                        <p className="text-slate-600">{result.content}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
} 