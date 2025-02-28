"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { dataSources, displayFormats } from '../app/api/query-builder/schema';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

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
    const [newDocSource, setNewDocSource] = React.useState("");

    const handleAddDocSource = () => {
        if (newDocSource.trim() && !documentSources.includes(newDocSource.trim())) {
            onDocumentSourcesChange([...documentSources, newDocSource.trim()]);
            setNewDocSource("");
        }
    };

    const handleRemoveDocSource = (sourceToRemove: string) => {
        onDocumentSourcesChange(documentSources.filter(source => source !== sourceToRemove));
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchQueryChange(e.target.value);
    };

    return (
        <Card className="w-full bg-white/70 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg font-medium text-slate-800">查询参数</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                    <Label className="text-slate-600">关键词</Label>
                    <Input
                        placeholder="输入搜索关键词"
                        value={searchQuery}
                        onChange={handleQueryChange}
                        className="bg-white"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-600">搜索范围</Label>
                    <Select>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="选择搜索范围" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部</SelectItem>
                            <SelectItem value="title">标题</SelectItem>
                            <SelectItem value="content">内容</SelectItem>
                        </SelectContent>
                    </Select>
                </div>



                <div className="space-y-2">
                    <Label className="text-slate-600">数据源</Label>
                    <div className="flex gap-2">
                        <Select
                            value={newDocSource}
                            onValueChange={setNewDocSource}
                        >
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="选择数据源" />
                            </SelectTrigger>
                            <SelectContent>
                                {dataSources.map((source) => (
                                    <SelectItem key={source} value={source}>
                                        {source}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleAddDocSource} className="bg-indigo-600 hover:bg-indigo-700">
                            添加
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {documentSources.map((source) => (
                            <Badge key={source} variant="secondary" className="px-3 py-1 bg-slate-100">
                                {source}
                                <X
                                    className="w-4 h-4 ml-2 cursor-pointer hover:text-indigo-600"
                                    onClick={() => handleRemoveDocSource(source)}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-600">显示格式</Label>
                    <Select
                        value={displayMode}
                        onValueChange={onDisplayModeChange}
                    >
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="选择显示格式" />
                        </SelectTrigger>
                        <SelectContent>
                            {displayFormats.map((format) => (
                                <SelectItem key={format} value={format}>
                                    {format}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end pt-2">
                    <Button onClick={onSubmit} className="bg-indigo-600 hover:bg-indigo-700">
                        应用更改
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
