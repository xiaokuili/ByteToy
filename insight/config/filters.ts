import { FileText, Globe, Book, Newspaper, MessageSquare, LayoutGrid, LayoutList } from "lucide-react";
import { createElement } from 'react';
import { JSX } from 'react';

// 数据源配置
export const dataSources = [
    "本地文档",
    "网络资源",
    "学术论文",
    "新闻报道",
    "社交媒体"
] as const;

export type DataSource = typeof dataSources[number];

// 展示格式配置
export const displayFormats = [
    "列表",
    "卡片",
    "详细",
    "摘要",
    "图表"
] as const;

export type DisplayFormat = typeof displayFormats[number];

// AI 模型配置
export const aiModels = [
    "GPT-4",
    "GPT-3.5",
    "Claude",
    "Gemini",
    "LLaMA"
] as const;

export type AIModel = typeof aiModels[number];

// 图标映射
export const sourceIcons: Record<DataSource, JSX.Element> = {
    "本地文档": createElement(FileText, { className: "w-4 h-4" }),
    "网络资源": createElement(Globe, { className: "w-4 h-4" }),
    "学术论文": createElement(Book, { className: "w-4 h-4" }),
    "新闻报道": createElement(Newspaper, { className: "w-4 h-4" }),
    "社交媒体": createElement(MessageSquare, { className: "w-4 h-4" })
};

export const formatIcons: Record<DisplayFormat, JSX.Element> = {
    "列表": createElement(LayoutList, { className: "w-4 h-4" }),
    "卡片": createElement(LayoutGrid, { className: "w-4 h-4" }),
    "详细": createElement(FileText, { className: "w-4 h-4" }),
    "摘要": createElement(MessageSquare, { className: "w-4 h-4" }),
    "图表": createElement(LayoutGrid, { className: "w-4 h-4" })
}; 