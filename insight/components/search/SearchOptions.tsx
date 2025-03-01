import { Upload, Database, LayoutGrid } from "lucide-react";
import { useRef } from "react";

interface SearchOptionsProps {
    onFileUpload: (file: File) => void;
    onDataSourceClick: () => void;
    onDisplayFormatClick: () => void;
    hasDataSourceSettings: boolean;
    hasDisplayFormatSettings: boolean;
    dataSourceName: string;
    displayFormatName: string;
}

export function SearchOptions({
    onFileUpload,
    onDataSourceClick,
    onDisplayFormatClick,
    hasDataSourceSettings,
    hasDisplayFormatSettings,
    dataSourceName = "百度",
    displayFormatName = "搜索"
}: SearchOptionsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-4">
            {/* 文件上传按钮 */}
            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-white/20 hover:border-white/40"
            >
                <Upload className="w-5 h-5" />
                <span>上传文档</span>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".txt,.pdf,.doc,.docx"
                />
            </button>

            {/* 数据源按钮 */}
            <button
                onClick={onDataSourceClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border
          ${hasDataSourceSettings
                        ? 'bg-white/20 text-white border-white/40'
                        : 'text-white/80 border-white/20 hover:text-white hover:bg-white/10 hover:border-white/40'}`}
            >
                <Database className="w-5 h-5" />
                <span>{dataSourceName}</span>
            </button>

            {/* 展示格式按钮 */}
            <button
                onClick={onDisplayFormatClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border
          ${hasDisplayFormatSettings
                        ? 'bg-white/20 text-white border-white/40'
                        : 'text-white/80 border-white/20 hover:text-white hover:bg-white/10 hover:border-white/40'}`}
            >
                <LayoutGrid className="w-5 h-5" />
                <span>{displayFormatName}</span>
            </button>
        </div>
    );
} 