"use client";

import * as React from "react";
import {
    X,
    FileText,
    Globe,
    LayoutGrid,
    LayoutList,
    Book,
    Newspaper,
    MessageSquare,
    ChevronUp,
    ChevronDown,
    Tags,
    Database,
    Layout,
    Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dataSources, displayFormats } from '../app/api/query-builder/schema';
import { motion, AnimatePresence } from "framer-motion";
import { RippleButton } from "@/components/magicui/ripple-button";

// 数据源图标映射
const sourceIcons = {
    "本地文档": <FileText className="w-4 h-4" />,
    "网络资源": <Globe className="w-4 h-4" />,
    "学术论文": <Book className="w-4 h-4" />,
    "新闻报道": <Newspaper className="w-4 h-4" />,
    "社交媒体": <MessageSquare className="w-4 h-4" />
};

// 展示样式图标映射
const formatIcons = {
    "列表": <LayoutList className="w-4 h-4" />,
    "卡片": <LayoutGrid className="w-4 h-4" />,
    "详细": <FileText className="w-4 h-4" />,
    "摘要": <MessageSquare className="w-4 h-4" />,
    "图表": <LayoutGrid className="w-4 h-4" />
};

interface QueryBuilderProps {
    documentSources: string[];
    onDocumentSourcesChange: (sources: string[]) => void;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    displayMode: string;
    onDisplayModeChange: (mode: string) => void;
    onSubmit: () => void;
}

export function QueryBuilder({
    documentSources,
    onDocumentSourcesChange,
    searchQuery,
    onSearchQueryChange,
    displayMode,
    onDisplayModeChange,
    onSubmit,
}: QueryBuilderProps) {
    const [keywords, setKeywords] = React.useState<string[]>([
        "人工智能", "机器学习", "深度学习", "神经网络", "自然语言处理"
    ]);
    const [isExpanded, setIsExpanded] = React.useState(true);
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const [isRecommended, setIsRecommended] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedSources, setSelectedSources] = React.useState<string[]>(documentSources);

    // 推荐的数据源
    const recommendedSources = ["学术论文", "网络资源"];

    // 过滤数据源
    const filteredSources = React.useMemo(() => {
        return dataSources.filter(source =>
            source.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const removeKeyword = (keyword: string) => {
        setKeywords(keywords.filter(k => k !== keyword));
    };

    // 处理数据源选择
    const handleSourceToggle = (source: string) => {
        setSelectedSources(prev => {
            const isSelected = prev.includes(source);
            if (isSelected) {
                return prev.filter(s => s !== source);
            } else {
                return [...prev, source];
            }
        });
    };

    // 应用选择的数据源
    const handleApplySelection = () => {
        onDocumentSourcesChange(selectedSources);
    };

    return (
        <Card className="shine-border bg-white/70 backdrop-blur-sm">
            {/* 标题栏和展开/收起按钮 */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="text-sm font-medium text-slate-600">查询参数</h3>
                <RippleButton
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 hover:bg-slate-100 rounded-md"
                    rippleColor="rgba(0, 0, 0, 0.1)"
                >
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-600" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-slate-600" />
                    )}
                </RippleButton>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden divide-y divide-slate-100"
                    >
                        {/* 关键词部分 */}
                        <div className="p-4 border-b border-slate-100">
                            <div className="flex items-center gap-2 mb-3 text-slate-600">
                                <Tags className="w-4 h-4" />
                                <h3 className="text-sm font-medium">AI 推荐关键词</h3>
                            </div>
                            <motion.div
                                className="flex flex-wrap gap-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {keywords.map((keyword) => (
                                    <motion.div
                                        key={keyword}
                                        className="keyword-tag"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {keyword}
                                        <X
                                            className="keyword-tag-remove hover:text-slate-600"
                                            onClick={() => removeKeyword(keyword)}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* 数据源选择 - 改进版 */}
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-slate-600" />
                                    <h3 className="text-sm font-medium text-slate-600">数据源</h3>
                                </div>
                                <div className="flex gap-2">
                                    <RippleButton
                                        onClick={() => setIsRecommended(true)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                                            ${isRecommended
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        智能推荐
                                    </RippleButton>
                                    <RippleButton
                                        onClick={() => setIsRecommended(false)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                                            ${!isRecommended
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        自定义选择
                                    </RippleButton>
                                </div>
                            </div>

                            {isRecommended ? (
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <p className="text-sm text-blue-600 mb-3">基于您的搜索内容，推荐以下数据源：</p>
                                    <motion.div
                                        className="grid grid-cols-2 gap-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        {recommendedSources.map(source => (
                                            <RippleButton
                                                key={source}
                                                onClick={() => onDocumentSourcesChange([source])}
                                                className={`flex items-center gap-2 p-2 rounded-lg transition-all
                                                    ${documentSources.includes(source)
                                                        ? 'bg-white text-blue-600 border border-blue-200'
                                                        : 'bg-white/80 border border-blue-100 text-slate-600'}`}
                                            >
                                                {sourceIcons[source as keyof typeof sourceIcons]}
                                                <span className="text-sm">{source}</span>
                                            </RippleButton>
                                        ))}
                                    </motion.div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* 搜索框 */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="搜索数据源..."
                                            className="w-full px-3 py-2 pr-8 rounded-lg border border-slate-200 
                                                     text-sm placeholder:text-slate-400 focus:border-blue-300 
                                                     focus:ring-2 focus:ring-blue-100 transition-all"
                                        />
                                        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                    </div>

                                    {/* 选择的数据源展示 */}
                                    {selectedSources.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSources.map(source => (
                                                <Badge
                                                    key={source}
                                                    className="px-2 py-1 bg-blue-50 text-blue-600 border border-blue-200"
                                                >
                                                    <span className="flex items-center gap-1">
                                                        {sourceIcons[source as keyof typeof sourceIcons]}
                                                        {source}
                                                    </span>
                                                    <X
                                                        className="w-3 h-3 ml-1 cursor-pointer hover:text-blue-800"
                                                        onClick={() => handleSourceToggle(source)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    {/* 搜索结果 */}
                                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 
                                                  scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                        {filteredSources.length > 0 ? (
                                            filteredSources.map(source => (
                                                <RippleButton
                                                    key={source}
                                                    onClick={() => handleSourceToggle(source)}
                                                    className={`flex items-center gap-2 p-2 rounded-lg transition-all
                                                        ${selectedSources.includes(source)
                                                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                            : 'bg-white border border-slate-100 text-slate-600 hover:border-blue-100'}`}
                                                >
                                                    {sourceIcons[source as keyof typeof sourceIcons]}
                                                    <span className="text-sm">{source}</span>
                                                </RippleButton>
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-center py-4 text-slate-500 text-sm">
                                                未找到匹配的数据源
                                            </div>
                                        )}
                                    </div>

                                    {/* 应用选择按钮 */}
                                    {selectedSources.length > 0 && (
                                        <div className="flex justify-end pt-2">
                                            <RippleButton
                                                onClick={handleApplySelection}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-full"
                                            >
                                                应用选择
                                            </RippleButton>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 展示样式 - 简化版 */}
                        <div className="p-4">
                            <motion.div
                                className="flex flex-wrap gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {displayFormats.map(format => (
                                    <RippleButton
                                        key={format}
                                        onClick={() => onDisplayModeChange(format)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all
                                            ${displayMode === format
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                                                : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-100'}`}
                                    >
                                        {formatIcons[format as keyof typeof formatIcons]}
                                        <span className="text-xs">{format}</span>
                                    </RippleButton>
                                ))}
                            </motion.div>
                        </div>

                        {/* 应用按钮 */}
                        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                            <div className="flex justify-end">
                                <RippleButton
                                    onClick={onSubmit}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm px-4 py-1.5 rounded-lg text-sm"
                                >
                                    应用更改
                                </RippleButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
