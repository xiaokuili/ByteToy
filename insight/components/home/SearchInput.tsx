import { Upload, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onFileUpload: (file: File) => Promise<{ loading: boolean, error: Error | null }>;
    onSearch: () => void;
    placeholder?: string;
   
}

export function SearchInput({
    value,
    onChange,
    onFileUpload,
    onSearch,
    placeholder = "请先上传文件，然后输入您想要的可视化效果...",
    
}: SearchInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hasFile, setHasFile] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            toast.error("请上传CSV格式的文件");
            return;
        }

        toast.info("正在上传文件");
        const result = await onFileUpload(file);
        setIsLoading(result.loading);
        
        if (result.error) {
            toast.error(result.error.message);
        } else {
            setHasFile(true);
            toast.success("文件上传成功");
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (isLoading) {
            toast.error("正在上传文件");
            return;
        }

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            toast.error("请上传CSV格式的文件");
            return;
        }
        setIsLoading(true);
        toast.info("正在上传文件");

        const result = await onFileUpload(file);
        setIsLoading(result.loading);
        
        if (result.error) {
            toast.error(result.error.message);
        } else {
            setHasFile(true);
            toast.success("文件上传成功");
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
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
                        disabled={isLoading}
                    />
                </div>


                {/* 下部按钮区域 */}
                <div className="flex items-center justify-between px-4 py-2 pt-0">
                    <div className="text-sm text-gray-500">
                        {hasFile ? '文件已上传' : '支持拖拽或点击上传CSV文件'}
                    </div>
                    <div className="flex items-center">
                        {/* 文件上传按钮 */}
                        <button
                            onClick={() => {
                                if (isLoading) {
                                    toast.error("正在处理中，请稍后再试");
                                    return;
                                }
                                fileInputRef.current?.click();
                            }}
                            disabled={isLoading}
                            className={`btn-icon mr-2 p-2 rounded-full transition-colors ${hasFile
                                    ? 'bg-green-100 hover:bg-green-200'
                                    : 'bg-blue-100 hover:bg-blue-200'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Upload className={`w-5 h-5 ${hasFile ? 'text-green-600' : 'text-blue-600'}`} />
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".csv"
                                disabled={isLoading}
                            />
                        </button>

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
                            disabled={!hasFile || isLoading}
                            className={`p-2 rounded-full transition-colors ${hasFile && !isLoading
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}