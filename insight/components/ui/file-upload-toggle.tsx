import { Upload, Search } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { useState, useRef } from "react"
import { useSearchParams } from 'next/navigation';


interface FileUploadToggleProps {
    isUpload: boolean
    onToggle: (value: boolean) => void
    onFileSelect?: (file: File) => void
    onSearch?: (text: string) => void
    className?: string
}

export function FileUploadToggle({ onToggle, onFileSelect, onSearch, className = "" }: FileUploadToggleProps) {
    const searchParams = useSearchParams();
    
    const [searchText, setSearchText] = useState(searchParams.get("q") || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onFileSelect) {
            onFileSelect(file);
        }
    };

    const handleSearch = () => {
        if (searchText.trim() && onSearch) {
            onSearch(searchText);
        }
    };

    return (
        <div className={`flex items-center w-full ${className}`}>
            <div className="flex-1 relative flex items-center">
                <Input
                    type="text"
                    placeholder="输入关键词..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pr-12 bg-white/50 border-slate-200 focus:border-indigo-200 focus:ring-indigo-100"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div className="absolute right-0 h-full flex items-center pr-3 gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-slate-100"
                        onClick={() => {
                            onToggle(true);
                            fileInputRef.current?.click();
                        }}
                    >
                        <Upload className="w-4 h-4 text-slate-500 hover:text-indigo-600" />
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".txt,.pdf,.doc,.docx"
                    />
                </div>
            </div>
            <Button
                className="ml-2 bg-indigo-600 hover:bg-indigo-700"
                onClick={handleSearch}
            >
                <Search className="w-4 h-4 mr-1" />
                搜索
            </Button>
        </div>
    )
} 