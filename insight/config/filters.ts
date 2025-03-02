import { createElement } from 'react';
import { Sparkles, Database, Globe, FileText, BarChart3, PieChart, LineChart, Table, List } from "lucide-react";
import { JSX } from 'react';

// AI 模型
export type AIModel = "DEEPSEEK" | "OPENAI" | "CLAUDE" | "GEMINI";
export const aiModels: AIModel[] = ["DEEPSEEK", "OPENAI", "CLAUDE", "GEMINI"];

// 数据源
export type DataSource = "百度" | "Google" | "Perplexity" | "本地文件" | "数据库";
export const dataSources: DataSource[] = ["百度", "Google", "Perplexity", "本地文件", "数据库"];

// 数据源图标
export const sourceIcons: Record<DataSource, JSX.Element> = {
    "百度": createElement(Globe, { className: "w-4 h-4" }),
    "Google": createElement(Globe, { className: "w-4 h-4" }),
    "Perplexity": createElement(Globe, { className: "w-4 h-4" }),
    "本地文件": createElement(FileText, { className: "w-4 h-4" }),
    "数据库": createElement(Database, { className: "w-4 h-4" })
};

// 展示格式类型定义
export type DisplayFormatType = "list" | "table" | "pie" | "bar" | "line";


// 展示格式结构
export interface DisplayFormatInfo {
    type: DisplayFormatType;  // 英文类型名
    label: string;         // 中文显示名
    icon: JSX.Element;       // 图标
    chartType?: string;      // 对应的图表类型 (如果适用)
}

// 展示格式映射
export const displayFormatMap: Record<DisplayFormatType, DisplayFormatInfo> = {
    "list": {
        type: "list",
        label: "列表",
        icon: createElement(List, { className: "w-4 h-4" })
    },
    "table": {
        type: "table",
        label: "表格",
        icon: createElement(Table, { className: "w-4 h-4" })
    },
    "pie": {
        type: "pie",
        label: "饼图",
        icon: createElement(PieChart, { className: "w-4 h-4" }),
        chartType: "pie"
    },
    "bar": {
        type: "bar",
        label: "柱状图",
        icon: createElement(BarChart3, { className: "w-4 h-4" }),
        chartType: "bar"
    },
    "line": {
        type: "line",
        label: "折线图",
        icon: createElement(LineChart, { className: "w-4 h-4" }),
        chartType: "line"
    }
};

// 为了向后兼容，保留原来的类型定义
export type DisplayFormat = "列表" | "表格" | "饼图" | "柱状图" | "折线图";
export const displayFormats: DisplayFormat[] = ["列表", "表格", "饼图", "柱状图", "折线图"];

// 为了向后兼容，保留原来的图标映射
export const formatIcons: Record<DisplayFormat, JSX.Element> = {
    "列表": createElement(List, { className: "w-4 h-4" }),
    "表格": createElement(Table, { className: "w-4 h-4" }),
    "饼图": createElement(PieChart, { className: "w-4 h-4" }),
    "柱状图": createElement(BarChart3, { className: "w-4 h-4" }),
    "折线图": createElement(LineChart, { className: "w-4 h-4" }),

};

// 类型转换辅助函数
export function getDisplayFormatInfo(format: DisplayFormat): DisplayFormatInfo {
    switch (format) {
        case "列表": return displayFormatMap.list;
        case "表格": return displayFormatMap.table;
        case "饼图": return displayFormatMap.pie;
        case "柱状图": return displayFormatMap.bar;
        case "折线图": return displayFormatMap.line;
        default: return displayFormatMap.list;
    }
}

export function getDisplayFormatType(format: DisplayFormat): DisplayFormatType {
    switch (format) {
        case "列表": return "list";
        case "表格": return "table";
        case "饼图": return "pie";
        case "柱状图": return "bar";
        case "折线图": return "line";
        default: return "list";
    }
}

export function getDisplayFormat(type: DisplayFormatType): DisplayFormat {
    switch (type) {
        case "list": return "列表";
        case "table": return "表格";
        case "pie": return "饼图";
        case "bar": return "柱状图";
        case "line": return "折线图";
        default: return "列表";
    }
} 