import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { DataSourceFilter } from "@/components/filters/DataSourceFilter";
import { DisplayFormatFilter } from "@/components/filters/DisplayFormatFilter";
import { ModelSelector } from "@/components/filters/ModelSelector";
import { DataSource, DisplayFormat, AIModel } from "@/config/filters";

interface AdvancedSearchPanelProps {
    isOpen: boolean;
    onClose: () => void;
    selectedSources: DataSource[];
    onSourcesChange: (sources: DataSource[]) => void;
    selectedFormat: DisplayFormat;
    onFormatChange: (format: DisplayFormat) => void;
    selectedModel: AIModel;
    onModelChange: (model: AIModel) => void;
}

export function AdvancedSearchPanel({
    isOpen,
    onClose,
    selectedSources,
    onSourcesChange,
    selectedFormat,
    onFormatChange,
    selectedModel,
    onModelChange,
}: AdvancedSearchPanelProps) {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-[rgb(var(--slate-200))] p-6 space-y-6 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[rgb(var(--slate-600))]">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">高级选项</span>
                </div>
                <button
                    onClick={onClose}
                    className="text-[rgb(var(--slate-600))] hover:text-[rgb(var(--primary))]"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-[rgb(var(--slate-600))]">AI 模型</h3>
                    <ModelSelector
                        selectedModel={selectedModel}
                        onChange={onModelChange}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-[rgb(var(--slate-600))]">数据源</h3>
                    <DataSourceFilter
                        selectedSources={selectedSources}
                        onChange={onSourcesChange}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-[rgb(var(--slate-600))]">展示格式</h3>
                    <DisplayFormatFilter
                        selectedFormat={selectedFormat}
                        onChange={onFormatChange}
                    />
                </div>
            </div>
        </div>
    );
} 