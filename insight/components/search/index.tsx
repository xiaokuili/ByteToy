import { Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChartFactory from './charts/ChartFactory';
import { ChartConfig, DisplayFormat, RenderConfig } from '@/lib/types';
import { formatIcons } from '@/config/filters';


// 搜索结果类型
export enum SearchResultType {
    RAG = 'rag',
    SEARCH_ENGINE = 'search_engine',
    CHART = 'chart'
}

export const RenderSearchResult = ({ format, config }: { format: DisplayFormat, config: RenderConfig }): React.ReactNode => {
    const isLoading = config.isLoading;
    const query = config?.query || '';

    console.log("format", format, config);
    return (
        <div className={cn(
            "rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80"
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

                {!isLoading && (
                    <div className="flex items-center">
                        <FormatIndicator formatInfo={format} />
                    </div>
                )}
            </div>

            <div className="p-5 bg-white/90 dark:bg-gray-850/90 border-t border-gray-200 dark:border-gray-700">
                {isLoading ? (
                    <div className="animate-pulse">
                        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                ) : (
                    <>
                        {format === "chart" && config.chartConfig && (
                            <div className="w-full">
                                <ChartFactory config={config.chartConfig} chartData={config.data} />
                            </div>
                        )}
                        {format === "search" && (
                            <div>
                                <h1>Search Results</h1>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// 展示格式指示器组件
function FormatIndicator({ formatInfo }: { formatInfo: DisplayFormat }) {
    return (
        <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-700">

        </div>
    );
}
