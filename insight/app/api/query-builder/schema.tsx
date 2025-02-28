import { z } from 'zod';
export const dataSources = [
    "本地文档",
    "网络资源",
    "学术论文",
    "新闻报道",
    "社交媒体"
];
export const displayFormats = [
    "列表",
    "卡片",
    "详细",
    "摘要",
    "图表"
];

export const queryBuilderSchema = z.object({


    // List of available data sources to query from
    dataSources: z.enum(dataSources as [string, ...string[]]).describe('Available data sources to select from'),

    // Search keywords/phrases to filter results
    searchTerms: z.array(
        z.string().describe('Search keyword or phrase to filter data')
    ).describe('List of search terms to apply'),

    // Output visualization format
    displayFormat: z.enum(displayFormats as [string, ...string[]]).describe('How the query results should be displayed')
});