import { Sparkles, Upload, Database, LayoutGrid, ArrowRight, Search, Send, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { AIModel } from "@/config/filters";
import { cn } from '@/lib/utils';
import { Message } from "ai";

interface SearchInputProps {
    className?: string;
    placeholder?: string;
    onSearch?: (query: string, intentMessages?: Message[]) => void;
    defaultModel?: string;
}

export default function SearchInput({
    className,
    placeholder = "输入您的问题...",
    onSearch,
    defaultModel = "GPT-4"
}: SearchInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const suggestions = [
        { command: '/创建图表', description: '创建新的数据可视化图表' },
        { command: '/美化图表', description: '优化现有图表的样式和外观' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setShowSuggestions(value === '/');
        // 检查是否包含命令前缀

    };

    const handleSuggestionClick = (command: string) => {
        setInputValue(command + ' ');
        setShowSuggestions(false);
    };



    return (
        <div className={cn(
            "fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-30",
            className
        )}>
            <div className="relative flex items-center backdrop-blur-md bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                {/* LLM 选择器 */}
                <div className="absolute left-3 flex items-center">
                    <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 font-medium">
                            {defaultModel}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                    </button>
                </div>

                {/* 输入框 */}
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full py-3 px-24 bg-transparent rounded-full focus:outline-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && onSearch) {
                            onSearch(inputValue);
                            setInputValue('');
                            setShowSuggestions(false);
                        }
                    }}
                />

                {/* 命令提示框 */}
                {showSuggestions && (
                    <div className="absolute bottom-full left-24 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => handleSuggestionClick(suggestion.command)}
                            >
                                <div className="font-medium text-sm">{suggestion.command}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{suggestion.description}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 发送按钮 */}
                <div className="absolute right-2">
                    <button
                        className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-full hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-500 dark:hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => {
                            if (onSearch) {
                                onSearch(inputValue);
                                setInputValue('');
                                setShowSuggestions(false);
                            }
                        }}
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}