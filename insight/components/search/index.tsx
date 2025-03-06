import { Search, Sparkles, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChartFactory from './charts/ChartFactory';
import { DisplayFormat, RenderConfig } from '@/lib/types';
import { toast } from 'sonner';

/**
 * 渲染搜索结果组件
 * @param format - 展示格式(chart/search/table)
 * @param config - 渲染配置
 */
export const RenderSearchResult = ({ format, config, onExport }: { format: DisplayFormat, config: RenderConfig, onExport: () => void }): React.ReactNode => {
    const { isLoading, isError, errorMessage, query = '' } = config;

    /**
     * 根据不同格式渲染对应内容
     */
    const renderContent = () => {
        if (format === "chart" && config.chartConfig) {
            return (
                <div className="w-full">
                    <ChartFactory config={config.chartConfig} chartData={config.data} />
                </div>
            );
        }
        if (format === "search") {
            return (
                <div>
                    <h1>Search Results</h1>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={cn(
            "rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80"
        )}>
            {/* 头部区域 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 p-4 flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600 rounded-full shadow-md">
                    <Search className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {query}
                        <span className={cn("inline-block", isLoading ? "animate-pulse" : "opacity-50")}>
                            <Sparkles className="h-4 w-4 text-amber-400" />
                        </span>
                    </h3>
                </div>

                {!isLoading && (
                    <div className="flex items-center gap-2">
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Export"
                            onClick={() => {
                                // TODO: Implement export functionality
                                onExport();
                            }}
                        >
                            <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                )}
            </div>

            {/* 内容区域 */}
            <div className="p-5 bg-white/90 dark:bg-gray-850/90 border-t border-gray-200 dark:border-gray-700">
                {isLoading ? (
                    <div className="animate-pulse">
                        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                ) : isError ? (
                    <div className="text-red-500">
                        Error: {errorMessage}
                    </div>
                ) : (
                    renderContent()
                )}
            </div>
        </div>
    );
};

/**
 * 展示格式指示器组件
 */
function FormatIndicator({ formatInfo }: { formatInfo: DisplayFormat }) {
    return (
        <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-700">
        </div>
    );
}
