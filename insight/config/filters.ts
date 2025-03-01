import { createElement } from 'react';
import { Sparkles, Database, Globe, FileText, BarChart3, PieChart, LineChart, Table, List } from "lucide-react";
import { JSX } from 'react';

// AI 模型
export type AIModel = "GPT-4" | "GPT-3.5" | "Claude" | "Gemini";
export const aiModels: AIModel[] = ["GPT-4", "GPT-3.5", "Claude", "Gemini"];

// 数据源
export type DataSource = "百度" | "Google" | "本地文件" | "网页" | "数据库";
export const dataSources: DataSource[] = ["百度", "Google", "本地文件", "网页", "数据库"];

// 数据源图标
export const sourceIcons: Record<DataSource, JSX.Element> = {
    "百度": createElement(Globe, { className: "w-4 h-4" }),
    "Google": createElement(Globe, { className: "w-4 h-4" }),
    "本地文件": createElement(FileText, { className: "w-4 h-4" }),
    "网页": createElement(Globe, { className: "w-4 h-4" }),
    "数据库": createElement(Database, { className: "w-4 h-4" })
};

// 展示格式
export type DisplayFormat = "列表" | "表格" | "饼图" | "柱状图" | "折线图" | "文本";
export const displayFormats: DisplayFormat[] = ["列表", "表格", "饼图", "柱状图", "折线图", "文本"];

// 格式图标
export const formatIcons: Record<DisplayFormat, JSX.Element> = {
    "列表": createElement(List, { className: "w-4 h-4" }),
    "表格": createElement(Table, { className: "w-4 h-4" }),
    "饼图": createElement(PieChart, { className: "w-4 h-4" }),
    "柱状图": createElement(BarChart3, { className: "w-4 h-4" }),
    "折线图": createElement(LineChart, { className: "w-4 h-4" }),
    "文本": createElement(FileText, { className: "w-4 h-4" })
}; 