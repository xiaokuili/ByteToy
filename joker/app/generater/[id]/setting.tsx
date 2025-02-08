"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDataSourcesByName } from "@/server/datasource";
import { DataConfig } from "@/server/generateOutlineSetting";
import { useOutline} from '@/hook/useOutline'
import { ChevronDown } from "lucide-react";
import {useInput} from '@/hook/useInput' 

export default function ReportSetting() {

  return <div className="flex flex-col gap-1 ">
    <div className="rounded-[12px] bg-[rgb(247,247,246)] p-4">
      <div>数据设置</div>
      <DataSetting />
    </div>
    <div className="rounded-[12px] bg-[rgb(247,247,246)] p-4">
      <div>生成设置</div>
      <GenerateSetting />
    </div>
  </div>;
}



function DataSetting() {
  return <div>
    <DataSettingSearch />
    <DataSettingItem />
    <DataSettingUpload />
  </div>;
}
function DataSettingSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DataConfig[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const search = async () => {
      setIsSearching(true);
      try {
        // TODO: Replace with actual search API call
        const results  = await getDataSourcesByName(searchTerm)
        setSearchResults(results as DataConfig[]);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debouncer = setTimeout(search, 500);
    return () => clearTimeout(debouncer);
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="text" 
        placeholder="搜索数据源..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isSearching ? (
        <div className="text-sm text-gray-500">搜索中...</div>
      ) : searchResults.length > 0 ? (
        <div className="flex flex-col gap-1">
          {searchResults.map((result) => (
            <div 
              key={result.id}
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
            >
              <span>{result.name}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {/* TODO: Handle add */}}
              >
                添加
              </Button>
            </div>
          ))}
        </div>
      ) : searchTerm && (
        <div className="text-sm text-gray-500">无搜索结果</div>
      )}
    </div>
  );
}
function DataSettingItem() {
  const {report_id, title} = useInput()
  const {generateDataConfig, currentOutline, DataConfigMessage, isDataConfigGenerating} = useOutline()
  const [dataConfig, setDataConfig] = useState<DataConfig[]>([])

  useEffect(() => {
    const generate = async () => {
      const dataConfig = await generateDataConfig({
        report_title: title, 
        report_id: report_id || "", 
        outline_id: currentOutline?.outlineID || "", 
        outline_title: currentOutline?.outlineTitle || "", 
      })
      setDataConfig(dataConfig)
    }
    generate()
  }, [report_id, title, currentOutline?.outlineID, currentOutline?.outlineTitle, generateDataConfig])

  if (!currentOutline) {
    return (
      <div className="text-sm text-gray-500 p-4">
        请先选择一个大纲项
      </div>
    )
  }

  if (isDataConfigGenerating) {
    return (
      <div className="text-sm text-gray-500 p-4">
        正在生成数据配置...
      </div>
    )
  }

  if (DataConfigMessage) {
    return (
      <div className="text-sm text-red-500 p-4">
        {DataConfigMessage}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {dataConfig.length === 0 ? (
        <div className="text-sm text-gray-500 p-4">
          暂无数据配置
        </div>
      ) : (
        dataConfig.map((config) => (
          <DataConfigItem key={config.id} config={config} />
        ))
      )}
    </div>
  )
}
function DataConfigItem({config}: {config: DataConfig}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div 
      className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm">{config.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </div>
      {isExpanded && (
        <div className="mt-2">
          <DataSourceDetail config={config} />
        </div>
      )}
    </div>
  )
}

function DataSourceDetail({config}: {config: DataConfig}) {
  return <div>
    <div>ID: {config.id}</div>
    <div>Description: {config.description}</div>
    <div>Category: {config.category}</div>
    <div>Tags: {config.tags?.join(', ')}</div>
  </div>
}

function DataSettingUpload() {
  return <div>  </div>
}

function GenerateSetting() {
  return <div>GenerateSetting</div>;
}

