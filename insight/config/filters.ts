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

// 展示格式
export type DisplayFormat = "列表" | "表格" | "饼图" | "柱状图" | "折线图";
export const displayFormats: DisplayFormat[] = ["列表", "表格", "饼图", "柱状图", "折线图"];

// 格式图标
export const formatIcons: Record<DisplayFormat, JSX.Element> = {
    "列表": createElement(List, { className: "w-4 h-4" }),
    "表格": createElement(Table, { className: "w-4 h-4" }),
    "饼图": createElement(PieChart, { className: "w-4 h-4" }),
    "柱状图": createElement(BarChart3, { className: "w-4 h-4" }),
    "折线图": createElement(LineChart, { className: "w-4 h-4" }),
}; 