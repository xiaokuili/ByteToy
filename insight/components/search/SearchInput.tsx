import { Sparkles, Upload, Database, LayoutGrid, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { AIModel } from "@/config/filters";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    selectedModel: AIModel;
    onModelClick: () => void;
    onDataSourceClick: () => void;
    onDisplayFormatClick: () => void;
    onFileUpload: (file: File) => void;
    onSearch: () => void;
    hasDataSourceSettings: boolean;
    hasDisplayFormatSettings: boolean;
    dataSourceName: string;
    displayFormatName: string;
    placeholder?: string;
}

export function SearchInput({
    value,
    onChange,
    selectedModel,
    onModelClick,
    onDataSourceClick,
    onDisplayFormatClick,
    onFileUpload,
    onSearch,
    hasDataSourceSettings,
    hasDisplayFormatSettings,
    dataSourceName,
    displayFormatName,
    placeholder = "Try using @ to select context..."
}: SearchInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<'display' | 'search'>('search');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    return (
        <div className="relative w-full max-w-4xl flex flex-col items-center">
            {/* 主搜索框 */}
            <div className="w-full flex flex-col bg-white rounded-3xl border border-slate-200 hover:border-slate-300 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 shadow-sm transition-all duration-300">
                {/* 上部输入区域 */}
                <div className="flex items-center p-4 pb-2">
                    {/* 搜索输入框 */}
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent border-0 text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 h-12 text-lg"
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                    />
                </div>

                {/* 下部按钮区域 */}
                <div className="flex items-center justify-between px-4 py-2 pt-0">
                    <div className="flex items-center">
                        {/* 模型选择器指示 */}
                        <button
                            onClick={onModelClick}
                            className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors mr-3"
                        >
                            <div className="bg-indigo-100 p-1 rounded-md">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="text-sm font-medium">{selectedModel}</span>
                        </button>

                        {/* 数据源按钮 */}
                        <button
                            onClick={onDataSourceClick}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors mr-3
                                ${hasDataSourceSettings
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`}
                        >
                            <div className={`p-1 rounded-md ${hasDataSourceSettings ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                                <Database className={`w-4 h-4 ${hasDataSourceSettings ? 'text-indigo-600' : 'text-slate-600'}`} />
                            </div>
                            <span className="text-sm font-medium">{dataSourceName}</span>
                        </button>
                    </div>

                    <div className="flex items-center">
                        {/* 文件上传按钮 */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-slate-600 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors mr-2"
                        >
                            <Upload className="w-5 h-5" />
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".txt,.pdf,.doc,.docx"
                            />
                        </button>

                        {/* 搜索按钮 */}
                        <button
                            onClick={onSearch}
                            className="p-2 text-white bg-indigo-500 hover:bg-indigo-600 rounded-full transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 底部 Tab 切换 */}
            <div className="flex w-full max-w-md mt-4 bg-white rounded-full border border-slate-200 p-1 shadow-sm">
                <button
                    onClick={() => {
                        setActiveTab('display');
                        onDisplayFormatClick();
                    }}
                    className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-full transition-colors text-sm font-medium
                        ${activeTab === 'display'
                            ? 'bg-indigo-500 text-white'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                    <LayoutGrid className={`w-4 h-4 ${activeTab === 'display' ? 'text-white' : 'text-slate-600'}`} />
                    <span>展示图</span>
                </button>

                <button
                    onClick={() => {
                        setActiveTab('search');
                        onSearch();
                    }}
                    className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-full transition-colors text-sm font-medium
                        ${activeTab === 'search'
                            ? 'bg-indigo-500 text-white'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                    <ArrowRight className={`w-4 h-4 ${activeTab === 'search' ? 'text-white' : 'text-slate-600'}`} />
                    <span>搜索结果</span>
                </button>
            </div>
        </div>
    );
} 