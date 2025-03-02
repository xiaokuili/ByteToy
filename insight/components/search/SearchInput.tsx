import { Sparkles, Upload, Database, LayoutGrid, ArrowRight, Search, Send, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { AIModel } from "@/config/filters";
import { cn } from '@/lib/utils';

interface SearchInputProps {
    className?: string;
    placeholder?: string;
    onSearch?: (query: string) => void;
    defaultModel?: string;
}

export default function SearchInput({
    className,
    placeholder = "输入您的问题...",
    onSearch,
    defaultModel = "GPT-4"
}: SearchInputProps) {
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
                    placeholder={placeholder}
                    className="w-full py-3 px-24 bg-transparent rounded-full focus:outline-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && onSearch) {
                            onSearch(e.currentTarget.value);
                            e.currentTarget.value = '';
                        }
                    }}
                />

                {/* 发送按钮 */}
                <div className="absolute right-2">
                    <button
                        className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-full hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-500 dark:hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        onClick={() => {
                            const input = document.querySelector('input') as HTMLInputElement;
                            if (input && onSearch) {
                                onSearch(input.value);
                                input.value = '';
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