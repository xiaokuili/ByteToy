"use client"

import { useState, useEffect } from "react"
import { FileUploadToggle } from "@/components/ui/file-upload-toggle"
import { DataSourceFilter } from "@/components/filters/DataSourceFilter"
import { DisplayFormatFilter } from "@/components/filters/DisplayFormatFilter"
import { SearchResults } from "@/components/search/SearchResults"
import { useSearchParams } from "next/navigation"

export default function SearchPage() {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isUpload, setIsUpload] = useState(false);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [displayFormat, setDisplayFormat] = useState("列表");

    // 从 URL 参数初始化状态
    useEffect(() => {
        const sources = searchParams.get('sources')?.split(',') || [];
        const format = searchParams.get('format') || "列表";
        setSelectedSources(sources);
        setDisplayFormat(format);

        // 如果有搜索词，自动执行搜索
        const query = searchParams.get('q');
        if (query) {
            handleSearch(query);
        }
    }, [searchParams]);

    const handleSearch = (query: string) => {
        if (!query.trim()) return;
        setIsLoading(true);
        // TODO: 实现搜索逻辑
        setTimeout(() => setIsLoading(false), 2000);
    };

    const handleFileSelect = (file: File) => {
        console.log('Selected file:', file);
        // TODO: 处理文件上传逻辑
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white page-enter">
            {/* Logo部分 */}
            <div className="container mx-auto px-6 py-4">
                <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
                              bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer">
                    WriteFinder
                </div>
            </div>

            {/* 搜索和筛选区域 */}
            <div className="container mx-auto px-6 py-8 space-y-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6
                              backdrop-blur-sm bg-white/70">
                    <FileUploadToggle
                        isUpload={isUpload}
                        onToggle={setIsUpload}
                        onFileSelect={handleFileSelect}
                        onSearch={handleSearch}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-slate-600">数据源</h3>
                            <DataSourceFilter
                                selectedSources={selectedSources}
                                onChange={setSelectedSources}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-slate-600">展示格式</h3>
                            <DisplayFormatFilter
                                selectedFormat={displayFormat}
                                onChange={setDisplayFormat}
                            />
                        </div>
                    </div>
                </div>

                {/* 搜索结果区域 */}
                <SearchResults isLoading={isLoading} />
            </div>
        </div>
    );
} 