import { createElement } from 'react';
import {  Database, Globe, FileText, BarChart3, PieChart, LineChart, Table, List } from "lucide-react";
import { JSX } from 'react';

// home config 
// AI 模型
export type AIModel = "DEEPSEEK" | "OPENAI" | "CLAUDE" | "GEMINI";
export const aiModels: AIModel[] = ["DEEPSEEK", "OPENAI", "CLAUDE", "GEMINI"];

// 数据源
export type DataSource = "搜索引擎" | "AI搜索" | "本地文件" | "数据库";
export const dataSources: DataSource[] = ["搜索引擎", "AI搜索", "本地文件", "数据库"];

// 数据源图标
export const sourceIcons: Record<DataSource, JSX.Element> = {
    "搜索引擎": createElement(Globe, { className: "w-4 h-4" }),
    "AI搜索": createElement(Globe, { className: "w-4 h-4" }),
    "本地文件": createElement(FileText, { className: "w-4 h-4" }),
    "数据库": createElement(Database, { className: "w-4 h-4" })
};

// 展示格式类型定义
// DisplayFormat 定义目前支持的类型
export type DisplayFormat = "list" | "table" | "pie" | "bar" | "line";
export const displayFormats: { label: string, type: DisplayFormat }[] = [
    { label: "列表", type: "list" },
    { label: "表格", type: "table" },
    { label: "饼图", type: "pie" },
    { label: "柱状图", type: "bar" },
    { label: "折线图", type: "line" }
];

// 为了向后兼容，保留原来的图标映射
export const formatIcons: Record<DisplayFormat, JSX.Element> = {
    "list": createElement(List, { className: "w-4 h-4" }),
    "table": createElement(Table, { className: "w-4 h-4" }),
    "pie": createElement(PieChart, { className: "w-4 h-4" }),
    "bar": createElement(BarChart3, { className: "w-4 h-4" }),
    "line": createElement(LineChart, { className: "w-4 h-4" }),

};
