import { useState } from "react";
import { cn } from '@/lib/utils';
import { Message } from "ai";
import { Send, Search, Loader2 } from "lucide-react";

interface SearchInputProps {
    className?: string;
    placeholder?: string;
    onSearch?: (query: string, intentMessages?: Message[]) => void;
    isLoading?: boolean;
}

export default function SearchInput({
    className,
    placeholder = "输入您的问题...",
    onSearch,
    isLoading = false,
}: SearchInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
    };

    return (
        <div className={cn(
            "fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-30",
            className
        )}>
            <div className={cn(
                "relative flex items-center backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg border",
                "transition-all duration-300 ease-in-out",
                isFocused 
                    ? "border-blue-400 dark:border-blue-500 shadow-blue-100 dark:shadow-blue-900/20" 
                    : "border-gray-200 dark:border-gray-700"
            )}>
                {/* 搜索图标 */}
                <div className="absolute left-4 text-gray-400 dark:text-gray-500">
                    <Search className="h-5 w-5" />
                </div>


                {/* 输入框 */}
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={cn(
                        "w-full py-4 pl-12 pr-16 bg-transparent rounded-full",
                        "focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500",
                        "text-gray-700 dark:text-gray-200"
                    )}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && onSearch) {
                            onSearch(inputValue);
                            setInputValue('');
                        }
                    }}
                />

                {/* 发送按钮 */}
                <div className="absolute right-2">
                    <button
                        disabled={isLoading}
                        className={cn(
                            "p-2.5 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700",
                            "text-white rounded-full transition-all duration-300",
                            "hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-500 dark:hover:to-purple-600", 
                            "shadow-md hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-900/30",
                            "transform hover:scale-105 active:scale-95",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        )}
                        onClick={() => {
                            if (onSearch && !isLoading) {
                                onSearch(inputValue);
                                setInputValue('');
                            }
                        }}
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
    );
}