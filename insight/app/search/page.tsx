"use client"

import { useState } from "react"
import { QueryBuilder } from "@/components/query-builder"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { Search, Globe, HardDrive, ExternalLink } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { SourceToggle } from "@/components/ui/source-toggle"
import { FileUploadToggle } from "@/components/ui/file-upload-toggle"

export default function SearchPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [isUpload, setIsUpload] = useState(false);

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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* 顶部搜索栏 */}
            <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-sm border-b border-slate-200 transition-all duration-300">
                <div className="container mx-auto px-6 h-16 flex items-center space-x-4">
                    <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        WriteFinder
                    </div>
                    <div className="flex-1 max-w-2xl">
                        <FileUploadToggle
                            isUpload={isUpload}
                            onToggle={setIsUpload}
                            onFileSelect={handleFileSelect}
                            onSearch={handleSearch}
                        />
                    </div>

                </div>
            </header>

            {/* 主要内容区域 */}
            <div className="container mx-auto max-w-3xl px-6 py-8 space-y-8">
                {/* 查询构建器区域 */}
                <QueryBuilder
                    documentSources={[]}
                    onDocumentSourcesChange={() => { }}
                    searchQuery=""
                    onSearchQueryChange={() => { }}
                    displayMode=""
                    onDisplayModeChange={() => { }}
                    onSubmit={() => {
                        setIsLoading(true);
                        setTimeout(() => setIsLoading(false), 2000);
                    }}
                />

                {/* 结果展示区域 */}
                <div className="space-y-6">
                    {isLoading ? (
                        Array(6).fill(0).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                    ) : (
                        Array(6).fill(0).map((_, i) => (
                            <Card
                                key={i}
                                className="group p-6 hover:-translate-y-1 transition-all duration-200 hover:shadow-lg hover:border-indigo-100 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-medium text-slate-800 group-hover:text-indigo-600 mb-1">
                                            搜索结果 {i + 1}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200">
                                                学术论文
                                            </Badge>
                                            <span>•</span>
                                            <span>2024-03-15</span>
                                            <span>•</span>
                                            <span>相关度: 95%</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600">
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    这是一个示例搜索结果的预览内容，展示了相关的摘要信息。这里可以显示更多的内容描述，
                                    包括来源、时间、相关度等信息。
                                </p>
                                <div className="flex items-center gap-2 mt-4">
                                    <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
                                        AI
                                    </Badge>
                                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                                        医疗
                                    </Badge>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
} 