"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchInput } from "@/components/search/SearchInput"
import { ModelSelector } from "@/components/filters/ModelSelector"
import { DataSourceFilter } from "@/components/filters/DataSourceFilter"
import { DisplayFormatFilter } from "@/components/filters/DisplayFormatFilter"
import { DataSource, DisplayFormat, AIModel } from "@/config/filters"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showDataSources, setShowDataSources] = useState(false);
  const [showDisplayFormat, setShowDisplayFormat] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>("GPT-4");
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [displayFormat, setDisplayFormat] = useState<DisplayFormat>("列表");
  const router = useRouter();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const params = new URLSearchParams({
      q: searchQuery,
      model: selectedModel,
      format: displayFormat,
      source: selectedSource || ""
    });

    router.push(`/search?${params.toString()}`);
  };

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file);
    // 处理文件上传逻辑
  };

  // 关闭所有面板
  const closeAllPanels = () => {
    setShowModelSelector(false);
    setShowDataSources(false);
    setShowDisplayFormat(false);
  };

  // 切换面板显示
  const togglePanel = (panel: 'model' | 'sources' | 'format') => {
    closeAllPanels();
    if (panel === 'model') setShowModelSelector(prev => !prev);
    if (panel === 'sources') setShowDataSources(prev => !prev);
    if (panel === 'format') setShowDisplayFormat(prev => !prev);
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center">
      {/* Logo */}
      <div className="mt-20 mb-4">
        <h1 className="text-4xl logo-text">WriteFinder</h1>
      </div>
      <h2 className="text-2xl text-slate-700 mb-12 font-medium">The next-Gen search engine for developers</h2>

      {/* 搜索区域 */}
      <div className="w-full px-4 flex flex-col items-center">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          selectedModel={selectedModel}
          onModelClick={() => togglePanel('model')}
          onDataSourceClick={() => togglePanel('sources')}
          onDisplayFormatClick={() => togglePanel('format')}
          onFileUpload={handleFileUpload}
          onSearch={handleSearch}
          hasDataSourceSettings={selectedSource !== null}
          hasDisplayFormatSettings={displayFormat !== "列表"}
          dataSourceName={selectedSource || "百度"}
          displayFormatName={displayFormat}
          placeholder="Try using @ to select context..."
        />

        {/* 模型选择面板 */}
        {showModelSelector && (
          <div className="panel mt-4 w-full max-w-4xl">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-700">AI Model</h3>
              <ModelSelector
                selectedModel={selectedModel}
                onChange={(model) => {
                  setSelectedModel(model);
                  setShowModelSelector(false);
                }}
              />
            </div>
          </div>
        )}

        {/* 数据源面板 */}
        {showDataSources && (
          <div className="panel mt-4 w-full max-w-4xl">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-700">Data Sources</h3>
              <DataSourceFilter
                selectedSource={selectedSource}
                onChange={(source) => {
                  setSelectedSource(source);
                  setShowDataSources(false);
                }}
              />
            </div>
          </div>
        )}

        {/* 展示格式面板 */}
        {showDisplayFormat && (
          <div className="panel mt-4 w-full max-w-4xl">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-700">Display Format</h3>
              <DisplayFormatFilter
                selectedFormat={displayFormat}
                onChange={(format) => {
                  setDisplayFormat(format);
                  setShowDisplayFormat(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
