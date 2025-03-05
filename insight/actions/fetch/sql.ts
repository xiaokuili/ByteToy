/**
 * SQL数据获取模块
 * 
 * 该模块负责:
 * 1. 将自然语言转换为SQL查询
 * 2. 执行SQL查询并返回结果
 * 3. 处理查询过程中的错误
 */

"use server";
import { FetchConfig, FetchResult } from "@/lib/types";

import { DataRecord } from "@/lib/types";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { db } from "@/lib/db";
import { DataSource } from "@/lib/types";

// OpenAI客户端配置
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

//=============================================================================
// 接口定义
//=============================================================================

/** SQL查询生成器函数类型 - 将自然语言转换为SQL */
export type generateSQLQuery = (input: string, datasource: DataSource) => Promise<string>;

/** SQL查询执行器函数类型 - 执行SQL并返回结果 */
export type runGenerateSQLQuery = (query: string, dbconfig?: DBConfig) => Promise<DataRecord[]>;

/** 数据库配置接口 */
export interface DBConfig {
    host: string;      // 数据库主机
    port: number;      // 端口号
    user: string;      // 用户名
    password: string;  // 密码
    database: string;  // 数据库名
    schema: string;    // 数据库模式
    engine: string;    // 数据引擎类型
}

/**
 * 生成SQL查询
 * @param input 用户输入的自然语言
 * @param datasource 数据源信息
 * @returns 生成的SQL查询语句
 */
export const generateQuery: generateSQLQuery = async (input: string, datasource: DataSource) => {
    "use server";
    try {
        const result = await generateObject({
            model: openai("gpt-4o"),
            system: `You are a SQL (postgres) and data visualization expert. Your job is to help the user write a SQL query to retrieve the data they need. 

    Table Schema:
    ${datasource.schema}

    Example Data Format:
    ${datasource.example_data}

    Fields:
    ${datasource.special_fields}

    Query Guidelines:
    - Only retrieval (SELECT) queries are allowed
    - For string fields, use case-insensitive search with: LOWER(column) ILIKE LOWER('%term%')
    - For comma-separated list columns, trim whitespace before grouping
    - When querying specific records, include both identifier and value columns

    Data Formatting:
    - Numeric values in billions use decimal format (10.0 = $10B)
    - Rates/percentages stored as decimals (0.1 = 10%)
    - Time-based analysis should group by year

    Visualization Requirements:
    - Every query must return data suitable for charts (minimum 2 columns)
    - Single column requests should include count/frequency
    - Rate queries should return decimal values
    - Include appropriate grouping columns for visualization context
    `,
            prompt: `Generate the query necessary to retrieve the data the user wants: ${input}`,
            schema: z.object({
                query: z.string(),
            }),
        });
        return result.object.query;
    } catch (e) {

        throw new Error("Failed to generate query");
    }
};

/**
 * 执行SQL查询
 * @param query SQL查询语句
 * @returns 查询结果数据
 */
export const runGenerateSQLQuery: runGenerateSQLQuery = async (query: string, dbconfig?: DBConfig) => {
    "use server";
    // 安全检查：仅允许SELECT语句
    if (
        !query.trim().toLowerCase().startsWith("select") ||
        query.trim().toLowerCase().includes("delete") ||
        query.trim().toLowerCase().includes("insert") ||
        query.trim().toLowerCase().includes("update") ||
        query.trim().toLowerCase().includes("alter") ||
        query.trim().toLowerCase().includes("truncate") ||
        query.trim().toLowerCase().includes("create") ||
        query.trim().toLowerCase().includes("grant") ||
        query.trim().toLowerCase().includes("revoke")
    ) {
        throw new Error("Only SELECT queries are allowed");
    }

    let data: any;
    // TODO:目前仅支持一个源，后续需要支持多个源
    const db = createConnection(dbconfig as DBConfig);
    try {
        data = await db.execute(query);
        console.log("data", data);
    } catch (e: any) {
        if (e.message.includes('relation "unicorns" does not exist')) {
            console.log(
                "Table does not exist, creating and seeding it with dummy data now...",
            );
            // throw error 
            throw Error("Table does not exist");
        } else {
            throw e;
        }
    }

    return data.rows as DataRecord[];
};

// TODO: 迁移到datasource模块
function createConnection(config: DBConfig) {
    // 根据配置创建连接
    // 例如：不同类型的数据库(MySQL, PostgreSQL等)
    // 不同的连接参数(主机、端口、凭证等)


    return db as any;

}
/**
 * SQL数据获取主函数
 * @param config 获取配置 
 * @returns 获取结果
 */
export const fetchFromSQL = async (config: FetchConfig): Promise<FetchResult> => {
    const { query: searchQuery, dataSource } = config;
    let sqlQuery: string;

    try {
        // 生成SQL查询
        sqlQuery = await generateQuery(searchQuery, dataSource as DataSource);
    } catch (error: any) {

        return {
            error: {
                code: 'SQL_ERROR',
                message: error.message,
                details: error
            },
            metadata: {
                message: "生成query出错"
            }

        }
    }

    try {
        // 执行查询
        const data = await runGenerateSQLQuery(sqlQuery);

        // 返回结果
        return {
            data,
            metadata: {
                query: sqlQuery,
                total: data.length
            }
        };
    } catch (error: any) {
        return {
            error: {
                code: 'SQL_ERROR',
                message: error.message,
                details: error
            }
        };
    }
}