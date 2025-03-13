import { Upload, Send, Loader2, File, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DataSource } from "@/lib/types";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onFileUpload: (file: File) => Promise<{ loading: boolean, error: Error | null }>;
    onSearch: () => void;
    placeholder?: string;
    getDatasource: () => DataSource | null | undefined;
    onRemove: () => void;
}

export function SearchInput({
    value,
    onChange,
    onFileUpload,
    onSearch,
    placeholder = "请先上传文件，支持拖拽上传， 然后输入您想要的可视化效果...",
    getDatasource,
    onRemove,
    
}: SearchInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasFile, setHasFile] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    
    const [isUploading, setIsUploading] = useState(false);
    const [isRemove, setIsRemove] = useState(false);
    const [dataSource, setDataSource] = useState<DataSource | null>(null);

    useEffect(() => {
        const dataSource = getDatasource()
        if (dataSource) {   
            setDataSource(dataSource)
            setHasFile(true)
        }
    }, []);

    const handleRemove =  () => {
        try {
            setIsRemove(true);  // 设置加载状态
            
            // 执行删除操作
            onRemove();  

            // 获取最新数据
            setDataSource(null)

            toast.success("删除成功");  
        } catch (error) {
            console.error("删除失败:", error);
            toast.error("删除失败");
        } finally {
            setIsRemove(false);  // 无论成功失败，都结束加载状态
        }
    };


    const handleFileUpload = async (file: File) => {
        if (!file.name.endsWith('.csv')) {
            toast.error("请上传CSV格式的文件");
            return;
        }

        toast.info("正在上传文件");
        setIsUploading(true);
        const result = await onFileUpload(file);
        setIsUploading(result.loading);
        
        if (result.error) {
            toast.error("文件上传失败" + result.error.message as string );
        } else {
            setHasFile(true);
            toast.success("文件上传成功");
        }
        const dataSource = getDatasource()
        if (dataSource) {
            setDataSource(dataSource)
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await handleFileUpload(file);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (isUploading) {
            toast.error("正在上传文件");
            return;
        }

        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        await handleFileUpload(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // Function to render the data source dropdown
    const renderDataSourceDropdown = () => {
        if (!dataSource) return null;
        
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        disabled={isUploading}
                        className={`btn-icon mr-2 p-2 rounded-full transition-colors bg-green-100 hover:bg-green-200 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <File className="w-5 h-5 text-green-600" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-0 shadow-md rounded-md border border-gray-200">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="font-medium text-sm text-gray-700">Attached Files</h3>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => {
                                    if (isUploading) {
                                        toast.error("正在上传文件");
                                        return;
                                    }
                                    fileInputRef.current?.click();
                                }}
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                                title="添加数据源"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={handleRemove}
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                                title="清除所有数据源"
                            >
                                {
                                    isRemove ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />
                                }
                            </button>
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                            <div  className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center space-x-2">
                                    <File className="w-4 h-4 text-gray-500" />
                                    <span className="truncate text-sm text-gray-700">{dataSource.name || `数据源`}</span>
                                </div>
                                <button 
                                    onClick={handleRemove}
                                    className="p-1 rounded-full hover:bg-gray-200 text-gray-400"
                                    title="移除数据源"
                                >
                                    {isRemove ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                       
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    return (
        <div
            className="relative w-full max-w-4xl flex flex-col items-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <div className={`input-container relative rounded-lg border ${isDragging
                    ? 'border-2 border-dashed border-blue-400 bg-blue-50'
                    : 'border border-gray-200'
                } transition-all duration-200`}>
                {isDragging && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 pointer-events-none">
                        <div className="text-blue-500 text-lg font-medium">
                            将CSV文件拖放到这里
                        </div>
                    </div>
                )}

                {/* 上部输入区域 */}
                <div className="flex items-center p-4 pb-2">
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 focus:outline-none !border-none !shadow-none !outline-none h-12 text-lg"
                        onKeyDown={(e) => hasFile && e.key === 'Enter' && onSearch()}
                        disabled={isUploading}
                    />
                </div>


                {/* 下部按钮区域 */}
                <div className="flex items-center justify-between px-4 py-2 pt-0">
               
                        {/* 数据源/文件按钮 */}
                        {dataSource ? (
                            renderDataSourceDropdown()
                        ) : (
                            <button
                                onClick={() => {
                                    if (isUploading) {
                                        toast.error("正在上传文件");
                                        return;
                                    }
                                    fileInputRef.current?.click();
                                }}
                                disabled={isUploading}
                                className={`btn-icon mr-2 p-2 rounded-full transition-colors bg-blue-100 hover:bg-blue-200 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Upload className="w-5 h-5 text-blue-600" />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".csv"
                                    disabled={isUploading}
                                />
                            </button>
                        )}

                        {/* 搜索按钮 */}
                        <button
                            onClick={() => {
                                if (!hasFile) {
                                    toast.error("请先上传文件");
                                    return;
                                }
                                try {
                                    onSearch();
                                } catch (err) {
                                    toast.error(`搜索失败: ${err instanceof Error ? err.message : '未知错误'}`);
                                }
                            }}
                            disabled={!hasFile || isUploading}
                            className={`p-2 rounded-full transition-colors ${hasFile && !isUploading
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isUploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </button>
                </div>
            </div>
        </div>
    );
}

