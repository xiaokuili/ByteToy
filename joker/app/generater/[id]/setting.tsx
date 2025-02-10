"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDataSourcesByName } from "@/server/datasource";
import { DataConfig, GenerateConfig } from "@/server/generateOutlineSetting";
import { useOutline} from '@/hook/useOutline'
import {  ExternalLink } from "lucide-react";
import {useInput} from '@/hook/useInput' 
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ReportSetting() {

  return <div className="flex flex-col gap-1 ">
    <div className="rounded-[12px] bg-[rgb(247,247,246)] p-4 gap-4 flex flex-col">
      <div>数据设置</div>
      <DataSetting />
    </div>
    <div className="rounded-[12px] bg-[rgb(247,247,246)] p-4 gap-4 flex flex-col">
      <div>生成设置</div>
      <GenerateSetting />
    </div>
  </div>;
}



function DataSetting() {
  return <div className="flex flex-col gap-2">
    <DataSettingSearch />
    <DataConfigItem />
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
function DataConfigItem() {
  const {report_id, title} = useInput()
  const {generateDataConfig, currentOutline, DataConfigMessage, isDataConfigGenerating} = useOutline()
  const [dataConfig, setDataConfig] = useState<DataConfig[]>([])

  console.log(currentOutline)
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
          <DataConfigDialog key={config.id} config={config} />
        ))
      )}
    </div>
  )
}

function DataConfigDialog({config}: {config: DataConfig}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div 
        className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{config.name}</span>
            <Badge variant="outline">{config.category}</Badge>
          </div>
          <Button variant="ghost" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{config.name}</DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">

            <div className="space-y-2">
              <Label>Input Schema</Label>
              <ScrollArea className="h-[100px] rounded border p-2">
                <pre className="text-sm">{JSON.stringify(config.input, null, 2)}</pre>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label>Output Schema</Label>
              <ScrollArea className="h-[100px] rounded border p-2">
                <pre className="text-sm">{JSON.stringify(config.output, null, 2)}</pre>
              </ScrollArea>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
              <Button onClick={() => {
                // TODO: Implement preview functionality
                console.log("Preview clicked")
              }}>Preview Data</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


function DataSettingUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      // TODO: Replace with actual upload API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        setFiles([]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600">
            拖拽文件到这里，或者
            <label className="text-blue-500 cursor-pointer hover:text-blue-600 ml-1">
              浏览
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInput}
              />
            </label>
          </p>
          <p className="text-xs text-gray-500">支持 CSV, Excel, JSON 等格式</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">已选择的文件:</div>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span>{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiles(files.filter((_, i) => i !== index))}
              >
                删除
              </Button>
            </div>
          ))}
          <Button 
            className="w-full mt-2" 
            onClick={handleUpload}
          >
            上传文件
          </Button>
        </div>
      )}
    </div>
  );
}

function GenerateSetting() {
  const [config, setConfig] = useState<GenerateConfig>({
    generationType: '',
    example: [],
  });

  const generateTypes = [
    { value: 'text', label: '文本' },
    { value: 'table', label: '表格' },
    { value: 'bar', label: '柱状图' },
    { value: 'line', label: '折线图' },
    { value: 'pie', label: '饼图' },
    { value: 'scatter', label: '散点图' },
  ];

  return (
    <div className="flex flex-col gap-4 ">
      <div className="space-y-2">
        <Label 
          htmlFor="generationType" 
          className="text-sm font-medium text-gray-700"
        >
          生成类型 
        </Label>
        <select
          id="generationType"
          value={config.generationType}
          onChange={(e) => setConfig({...config, generationType: e.target.value})}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
        >
          <option value="" className="text-gray-500">请选择生成类型</option>
          {generateTypes.map((type) => (
            <option 
              key={type.value} 
              value={type.value}
              className="text-gray-900"
            >
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {config.generationType === 'text' && (
        <div className="space-y-2">
          <Label 
            htmlFor="example" 
            className="text-sm font-medium text-gray-700"
          >
            历史样例
          </Label>
          <Textarea
            id="example"
            value={config.example.join('\n')}
            onChange={(e) => setConfig({...config, example: e.target.value.split('\n')})}
            placeholder="每行输入一个历史样例"
            rows={4}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors resize-none"
          />
        </div>
      )}
    </div>
  );
}
