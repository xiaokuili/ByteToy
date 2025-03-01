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
            <div className="input-container">
                {/* 上部输入区域 */}
                <div className="flex items-center p-4 pb-2">
                    {/* 搜索输入框 */}
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 focus:outline-none !border-none !shadow-none !outline-none h-12 text-lg "
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                    />
                </div>

                {/* 下部按钮区域 */}
                <div className="flex items-center justify-between px-4 py-2 pt-0">
                    <div className="flex items-center">
                        {/* 模型选择器指示 */}
                        <button
                            onClick={onModelClick}
                            className="model-badge mr-3"
                        >
                            <div className="model-icon">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="text-sm font-medium">{selectedModel}</span>
                        </button>

                        {/* 数据源按钮 */}
                        <button
                            onClick={onDataSourceClick}
                            className={`model-badge mr-3 ${hasDataSourceSettings ? 'bg-indigo-50 text-indigo-700' : ''}`}
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
                            className="btn-icon mr-2"
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
                            className="btn-primary p-2"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 底部 Tab 切换 */}
            <div className="tab-container max-w-md mt-4">
                <button
                    onClick={() => {
                        setActiveTab('display');
                        onDisplayFormatClick();
                    }}
                    className={`tab ${activeTab === 'display' ? 'tab-active' : 'tab-inactive'}`}
                >
                    <LayoutGrid className={`w-4 h-4 ${activeTab === 'display' ? 'text-white' : 'text-slate-600'}`} />
                    <span>展示图</span>
                </button>

                <button
                    onClick={() => {
                        setActiveTab('search');
                        onSearch();
                    }}
                    className={`tab ${activeTab === 'search' ? 'tab-active' : 'tab-inactive'}`}
                >
                    <ArrowRight className={`w-4 h-4 ${activeTab === 'search' ? 'text-white' : 'text-slate-600'}`} />
                    <span>搜索结果</span>
                </button>
            </div>
        </div>
    );
} 