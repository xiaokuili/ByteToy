"use server"

import { and, like, eq } from "drizzle-orm";
import db from "@/lib/drizzle"
import { dataSources } from "@/schema"



// 获取数据后续需要重写，基于不同的类型提供不同的方式
export async function getDataSources() {
    // Get all active data sources
    const sources = await db.select({
        id: dataSources.id,
        name: dataSources.name,
        category: dataSources.category,
        description: dataSources.description,
        input: dataSources.input,
        output: dataSources.output,
        tags: dataSources.tags,
        status: dataSources.status
    })
        .from(dataSources)
        .where(eq(dataSources.status, 'active'));

    return sources;
}


export async function getDataSourcesByName(name: string) {
    // Get active data sources matching the name
    const sources = await db.select({
        id: dataSources.id,
        name: dataSources.name,
        category: dataSources.category,
        description: dataSources.description,
        input: dataSources.input,
        output: dataSources.output,
        tags: dataSources.tags,
        status: dataSources.status
    })
        .from(dataSources)
        .where(
            and(
                eq(dataSources.status, 'active'),
                like(dataSources.name, `%${name}%`)
            )
        );

    return sources;
}


// 基础数据源接口
interface DataSourceAdapter<T = unknown, R = unknown> {
    fetch(params: T): Promise<R>;
}

// 转换器类型
type Transformer<R, O> = (data: R) => O;

// 数据源管理器
class DataSourceManager {
    private sources = new Map<string, DataSourceAdapter>();

    register<T, R>(type: string, source: DataSourceAdapter<T, R>) {
        this.sources.set(type, source);
    }

    async fetch<T, O, R>(
        type: string, 
        params: T,
        transformer?: Transformer<O, R>
    ): Promise<O | R> {
        const source = this.sources.get(type) as DataSourceAdapter<T, O>;
        const result = await source.fetch(params);
        return transformer ? transformer(result) : result;
    }
}

// 小红书查询参数
interface XHSParams {
    keyword: string;
    limit?: number;
}

// 小红书返回结果
interface XHSResponse {
    posts: {
        id: string;
        title: string;
        content: string;
        images: string[];
        likes: number;
        comments: number;
    }[];
}

// 百度查询参数
interface BaiduParams {
    query: string;
    pageSize?: number;
    pageNum?: number;
}

// 百度返回结果
interface BaiduResponse {
    results: {
        title: string;
        link: string;
        snippet: string;
    }[];
    total: number;
}

// 小红书数据源实现
class XiaohongshuDataSource implements DataSourceAdapter<XHSParams, XHSResponse> {
    async fetch(params: XHSParams): Promise<XHSResponse> {
        // TODO: 实现小红书 API 调用
        // 这里需要实现实际的 API 调用逻辑
        return {
            posts: []
        };
    }
}

// 百度数据源实现
class BaiduDataSource implements DataSourceAdapter<BaiduParams, BaiduResponse> {
    async fetch(params: BaiduParams): Promise<BaiduResponse> {
        // TODO: 实现百度搜索 API 调用
        // 这里需要实现实际的 API 调用逻辑
        return {
            results: [],
            total: 0
        };
    }
}

// 初始化数据源管理器
const dataSourceManager = new DataSourceManager();

// 注册数据源
dataSourceManager.register('xiaohongshu', new XiaohongshuDataSource());
dataSourceManager.register('baidu', new BaiduDataSource());

// 导出数据源管理器实例
export { dataSourceManager };

