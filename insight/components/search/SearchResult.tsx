import { Search, Sparkles, Code, FileText, BarChart as BarChartIcon, Table, List } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import ChartFactory from './charts/ChartFactory';
import { ChartConfig, ChartData } from './charts/ChartTypes';

// 定义可能的内容类型
export type ContentFormat = 'text' | 'code' | 'table' | 'chart' | 'list' | 'file';

// 基础搜索结果属性
interface BaseSearchResultProps {
    query: string;
    isLoading?: boolean;
    className?: string;
}

// 不同内容类型的特定属性
interface TextContentProps {
    format: 'text';
    content: string | ReactNode;
}

interface CodeContentProps {
    format: 'code';
    language: string;
    code: string;
}

interface TableContentProps {
    format: 'table';
    headers: string[];
    rows: (string | number | ReactNode)[][];
}

interface ChartContentProps {
    format: 'chart';
    chartConfig: ChartConfig;
}

interface ListContentProps {
    format: 'list';
    items: (string | ReactNode)[];
    ordered?: boolean;
}

interface FileContentProps {
    format: 'file';
    fileName: string;
    fileType: string;
    fileContent?: string;
    fileUrl?: string;
}

// 联合类型
type ContentTypeProps =
    TextContentProps |
    CodeContentProps |
    TableContentProps |
    ChartContentProps |
    ListContentProps |
    FileContentProps;

// 完整的搜索结果属性
type SearchResultProps = BaseSearchResultProps & ContentTypeProps;

export default function SearchResult(props: SearchResultProps) {
    const { query, isLoading = false, className } = props;

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

                {/* 内容类型指示器 */}
                {!isLoading && (
                    <div className="flex items-center">
                        <ContentTypeIndicator format={props.format} />
                    </div>
                )}
            </div>

            <div className="p-5 bg-white/90 dark:bg-gray-850/90 border-t border-gray-200 dark:border-gray-700">
                {isLoading ? (
                    <SkeletonContent format={props.format} />
                ) : (
                    <ContentRenderer {...props} />
                )}
            </div>
        </div>
    );
}

// 内容类型指示器组件
function ContentTypeIndicator({ format }: { format: ContentFormat }) {
    const iconMap = {
        text: <FileText className="h-4 w-4 text-blue-500" />,
        code: <Code className="h-4 w-4 text-purple-500" />,
        table: <Table className="h-4 w-4 text-green-500" />,
        chart: <BarChartIcon className="h-4 w-4 text-orange-500" />,
        list: <List className="h-4 w-4 text-indigo-500" />,
        file: <FileText className="h-4 w-4 text-gray-500" />
    };

    return (
        <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-700">
            {iconMap[format]}
        </div>
    );
}

// 内容渲染器组件
function ContentRenderer(props: SearchResultProps) {
    switch (props.format) {
        case 'text':
            return <TextContent content={props.content} />;
        case 'code':
            return <CodeContent language={props.language} code={props.code} />;
        case 'table':
            return <TableContent headers={props.headers} rows={props.rows} />;
        case 'chart':
            return <ChartContent chartConfig={props.chartConfig} />;
        case 'list':
            return <ListContent items={props.items} ordered={props.ordered} />;
        case 'file':
            return <FileContent
                fileName={props.fileName}
                fileType={props.fileType}
                fileContent={props.fileContent}
                fileUrl={props.fileUrl}
            />;
        default:
            return <div>未支持的内容类型</div>;
    }
}

// 文本内容组件
function TextContent({ content }: { content: string | ReactNode }) {
    if (typeof content === 'string') {
        return (
            <div className="prose dark:prose-invert max-w-none">
                {content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        );
    }

    return (
        <div className="prose dark:prose-invert max-w-none">
            {content}
        </div>
    );
}

// 代码内容组件
function CodeContent({ language, code }: { language: string; code: string }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">{language}</span>
                <button className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    复制代码
                </button>
            </div>
            <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 shadow-inner overflow-x-auto">
                <code className={`language-${language}`}>{code}</code>
            </pre>
        </div>
    );
}

// 表格内容组件
function TableContent({ headers, rows }: { headers: string[]; rows: (string | number | ReactNode)[][] }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// 图表内容组件
function ChartContent({ chartConfig }: { chartConfig: ChartConfig }) {
    return (
        <div className="w-full">
            <ChartFactory config={chartConfig} />
        </div>
    );
}

// 列表内容组件
function ListContent({ items, ordered = false }: { items: (string | ReactNode)[]; ordered?: boolean }) {
    if (ordered) {
        return (
            <ol className="list-decimal pl-5 space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
                ))}
            </ol>
        );
    }

    return (
        <ul className="list-disc pl-5 space-y-2">
            {items.map((item, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
            ))}
        </ul>
    );
}

// 文件内容组件
function FileContent({
    fileName,
    fileType,
    fileContent,
    fileUrl
}: {
    fileName: string;
    fileType: string;
    fileContent?: string;
    fileUrl?: string;
}) {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{fileName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{fileType}</span>
                </div>
                {fileUrl && (
                    <a
                        href={fileUrl}
                        download={fileName}
                        className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        下载
                    </a>
                )}
            </div>
            {fileContent && (
                <div className="p-4 max-h-64 overflow-y-auto bg-white dark:bg-gray-900">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{fileContent}</pre>
                </div>
            )}
        </div>
    );
}

// 骨架屏组件
function SkeletonContent({ format = 'text' }: { format?: ContentFormat }) {
    // 根据不同的内容类型返回不同的骨架屏
    switch (format) {
        case 'code':
            return (
                <div className="animate-pulse space-y-4">
                    <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
            );
        case 'table':
            return (
                <div className="animate-pulse space-y-4">
                    <div className="flex space-x-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex space-x-4">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            );
        case 'chart':
            return (
                <div className="animate-pulse">
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
            );
        case 'list':
            return (
                <div className="animate-pulse space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex space-x-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            );
        case 'file':
            return (
                <div className="animate-pulse space-y-4">
                    <div className="flex justify-between">
                        <div className="flex space-x-2">
                            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                        </div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
            );
        default:
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
} 