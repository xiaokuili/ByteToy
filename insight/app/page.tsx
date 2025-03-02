"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SearchInput } from "@/components/home/SearchInput"
import { ModelSelector } from "@/components/filters/ModelSelector"
import { DataSourceFilter } from "@/components/filters/DataSourceFilter"
import { DisplayFormatFilter } from "@/components/filters/DisplayFormatFilter"
import { DataSource, DisplayFormat, AIModel, DisplayFormatType, getDisplayFormat } from "@/config/filters"
import Head from "next/head";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showDataSources, setShowDataSources] = useState(false);
  const [showDisplayFormat, setShowDisplayFormat] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>("DEEPSEEK");
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
    <>

      <Head>
        <title>ByteToy Insight - 智能搜索与知识管理平台</title>
        <meta name="description" content="ByteToy Insight 是一个现代化的智能搜索与知识管理平台，帮助您更高效地获取和组织信息。" />
        <meta name="keywords" content="智能搜索,知识管理,AI,人工智能,ByteToy" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
        {/* 背景装饰元素 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-40 w-80 h-80 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8">
          {/* Logo 和标题 */}
          <div className="text-center mb-8 flex flex-col items-center">
            <div className="mb-4 relative w-24 h-24">
              {/* 这里可以替换为实际的 logo 图片 */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">BT</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              ByteToy Insight
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              智能搜索与知识管理平台
            </p>
          </div>

          {/* 搜索输入框 */}
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
            dataSourceName={selectedSource || "百度"}
            placeholder="输入您的问题，开始智能搜索..."
            onSearchResultClick={() => closeAllPanels()}
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
    </>
  );
}
