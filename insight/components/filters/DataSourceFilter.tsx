import { useState } from "react";
import { DataSource, dataSources, sourceIcons } from "@/config/filters";
import { ChevronRight, File, Database, Table, FolderOpen } from "lucide-react";

interface DataSourceFilterProps {
    selectedSource: DataSource | null;
    onChange: (source: DataSource | null) => void;
    className?: string;
}

export function DataSourceFilter({ selectedSource, onChange, className = "" }: DataSourceFilterProps) {
    const [expandedSource, setExpandedSource] = useState<DataSource | null>(null);

    // 模拟的本地文件列表
    const localFiles = [
        { id: "file1", name: "research_data.csv", type: "csv" },
        { id: "file2", name: "project_notes.docx", type: "docx" },
        { id: "file3", name: "analysis.pdf", type: "pdf" },
        { id: "file4", name: "presentation.pptx", type: "pptx" }
    ];

    // 模拟的数据库表列表
    const databaseTables = [
        { id: "table1", name: "users", records: 1245 },
        { id: "table2", name: "products", records: 532 },
        { id: "table3", name: "orders", records: 8721 },
        { id: "table4", name: "analytics", records: 12543 }
    ];

    // 处理源选择
    const handleSourceClick = (source: DataSource) => {
        if (source === "本地文件" || source === "数据库") {
            // 如果点击的是可展开的源
            if (expandedSource === source) {
                // 如果已经展开，则关闭
                setExpandedSource(null);
            } else {
                // 否则展开，但不调用 onChange
                setExpandedSource(source);
                // 不在这里调用 onChange(source)
            }
        } else {
            // 如果点击的是普通源，直接选择
            onChange(source);
            setExpandedSource(null);
        }
    };

    // 处理文件选择
    const handleFileSelect = (fileId: string, fileName: string) => {
        console.log(`Selected file: ${fileName} (${fileId})`);
        // 选择文件后，关闭面板并通知父组件
        onChange("本地文件"); // 或者传递更具体的信息
        setExpandedSource(null);
    };

    // 处理表选择
    const handleTableSelect = (tableId: string, tableName: string) => {
        console.log(`Selected table: ${tableName} (${tableId})`);
        // 选择表后，关闭面板并通知父组件
        onChange("数据库"); // 或者传递更具体的信息
        setExpandedSource(null);
    };

    // 获取文件图标
    const getFileIcon = (fileType: string) => {
        switch (fileType) {
            case "csv":
                return <File className="w-4 h-4 text-green-500" />;
            case "docx":
                return <File className="w-4 h-4 text-blue-500" />;
            case "pdf":
                return <File className="w-4 h-4 text-red-500" />;
            case "pptx":
                return <File className="w-4 h-4 text-orange-500" />;
            default:
                return <File className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {/* 主数据源选择 */}
            <div className="flex flex-wrap gap-2">
                {dataSources.map(source => (
                    <button
                        key={source}
                        onClick={() => handleSourceClick(source)}
                        className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                            ${selectedSource === source
                                ? 'bg-[rgb(var(--primary-light))] text-[rgb(var(--primary))] border border-[rgb(var(--primary-border))]'
                                : 'bg-white border border-[rgb(var(--slate-200))] text-[rgb(var(--slate-600))] hover:border-[rgb(var(--primary-border))]'}`}
                    >
                        <div className="flex items-center gap-2">
                            {sourceIcons[source]}
                            <span>{source}</span>
                        </div>
                        {(source === "本地文件" || source === "数据库") && (
                            <ChevronRight className={`w-4 h-4 transition-transform ${expandedSource === source ? 'rotate-90' : ''}`} />
                        )}
                    </button>
                ))}
            </div>

            {/* 本地文件二级选择 */}
            {expandedSource === "本地文件" && (
                <div className="ml-4 mt-2 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <FolderOpen className="w-4 h-4" />
                        <span>选择文件</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {localFiles.map(file => (
                            <button
                                key={file.id}
                                onClick={() => handleFileSelect(file.id, file.name)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                            >
                                {getFileIcon(file.type)}
                                <span className="text-sm truncate">{file.name}</span>
                            </button>
                        ))}
                    </div>
                    <button className="w-full mt-2 text-sm text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 py-1">
                        <span>上传新文件</span>
                        <File className="w-3 h-3" />
                    </button>
                </div>
            )}

            {/* 数据库表二级选择 */}
            {expandedSource === "数据库" && (
                <div className="ml-4 mt-2 space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <Database className="w-4 h-4" />
                        <span>选择数据表</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {databaseTables.map(table => (
                            <button
                                key={table.id}
                                onClick={() => handleTableSelect(table.id, table.name)}
                                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Table className="w-4 h-4 text-indigo-500" />
                                    <span className="text-sm">{table.name}</span>
                                </div>
                                <span className="text-xs text-slate-500">{table.records} 行</span>
                            </button>
                        ))}
                    </div>
                    <button className="w-full mt-2 text-sm text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 py-1">
                        <span>连接新数据表</span>
                        <Table className="w-3 h-3" />
                    </button>
                </div>
            )}
        </div>
    );
} 