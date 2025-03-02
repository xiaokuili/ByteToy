import { Search, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SearchResultProps {
    query: string;
    isLoading?: boolean;
    children?: ReactNode;
    className?: string;
}

export default function SearchResult({ query, isLoading = false, children, className }: SearchResultProps) {
    return (
        <div className={cn(
            "rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80",
            className
        )}>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 p-4 flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600 rounded-full shadow-md">
                    <Search className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {query}
                        {isLoading && (
                            <span className="inline-block animate-pulse">
                                <Sparkles className="h-4 w-4 text-amber-400" />
                            </span>
                        )}
                    </h3>
                </div>
            </div>

            <div className="p-5 bg-white/90 dark:bg-gray-850/90 border-t border-gray-200 dark:border-gray-700">
                {isLoading ? (
                    <SkeletonContent />
                ) : (
                    <div className="prose dark:prose-invert max-w-none">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}

function SkeletonContent() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>

            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>

            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
    );
} 