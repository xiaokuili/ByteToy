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
import { generateObject, Message } from "ai";
import { z } from "zod";
import { db } from "@/lib/db";
import { DataSource, Fetch } from "@/lib/types";
import { filterMessagesByTokenCount } from "@/lib/utils";
// OpenAI客户端配置
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

//=============================================================================
// 接口定义
//=============================================================================

/** SQL查询生成器函数类型 - 将自然语言转换为SQL */
export type generateSQLQuery = (input: string, datasource: DataSource, messages?: Message[]) => Promise<{ query: string; messages: Message[] }>;

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
 * @param messages 对话历史记录
 * @returns 生成的SQL查询语句
 */
export const generateQuery: generateSQLQuery = async (input: string, datasource: DataSource, messages?: Message[]): Promise<{ query: string; messages: Message[] }> => {
    "use server";
    try {
        const systemMessage: Message = {
            id: "system",
            role: "system",
            content: `You are a SQL (postgres) and data visualization expert. Your job is to help the user write a SQL query to retrieve the data they need.

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
- Include appropriate grouping columns for visualization context`
        };


        const userMessage: Message = {
            id: 'user',
            role: 'user',
            content: input
        };

        const allMessages: Message[] = messages ? [...messages, userMessage] : [systemMessage, userMessage];
        // Filter messages to only include system, user and data roles
        const filteredMessages = allMessages.filter(msg => ['system', 'user', 'data'].includes(msg.role));

        const chatMessages = filterMessagesByTokenCount(filteredMessages);
        const result = await generateObject({
            model: openai("gpt-4"),
            messages: chatMessages,
            schema: z.object({
                query: z.string(),
                reasoning: z.string()
            }),
        });

        const finalMessage: Message[] = [...allMessages, {
            id: "data",
            role: "data",
            content: result.object.query,
            type: "sql"
        } as Message]
        return {
            query: result.object.query,
            messages: finalMessage
        }
    } catch (e) {
        throw new Error("Failed to generate query: " + (e as Error).message);
    }
};

/**
 * 执行SQL查询
 * @param query SQL查询语句
 * @returns 查询结果数据
 */
export const RunGenerateSQLQuery: runGenerateSQLQuery = async (query: string, dbconfig?: DBConfig) => {
    "use server";
    // 安全检查：仅允许SELECT语句
    const normalizedQuery = query.toLowerCase().trim();
    
    if (
        !normalizedQuery.startsWith("select") ||
        normalizedQuery.includes("delete") ||
        normalizedQuery.includes("insert") ||
        normalizedQuery.includes("update") ||
        normalizedQuery.includes("alter") ||
        normalizedQuery.includes("truncate") ||
        normalizedQuery.includes("grant") ||
        normalizedQuery.includes("revoke")
    ) {
        throw new Error("Only SELECT queries are allowed");
    }

    let data: {
        rows: DataRecord[];
        
    };

    // TODO:目前仅支持一个源，后续需要支持多个源
    const db = createConnection(dbconfig as DBConfig);
    try {
        data = await db.execute(normalizedQuery);
    } catch (e: unknown) {
        if (e instanceof Error && e.message.includes('relation "unicorns" does not exist')) {
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


    return db;

}
/**
 * SQL数据获取主函数
 * @param config 获取配置 
 * @returns 获取结果和消息
 */
export const fetchFromSQL: Fetch = async (config: FetchConfig): Promise<{ result: FetchResult; messages?: Message[] }> => {
    const { query: searchQuery, dataSource, messages } = config;
    let sqlQuery: string;
    let newMessages: Message[] = messages || [];
    try {
        // 生成SQL查询
        const { query, messages: genMessages } = await generateQuery(searchQuery, dataSource as DataSource);
        sqlQuery = query;
        if (genMessages) {
            newMessages = genMessages;
        }
    } catch (error: unknown) {
        return {
            result: {
                data: [],
                error: {
                    code: 'SQL_ERROR',
                    message: (error as Error).message,
                    details: error
                },
                metadata: {
                    message: "生成query出错"
                }
            },
            messages: newMessages
        }
    }

    try {
        // 执行查询
        const data = await RunGenerateSQLQuery(sqlQuery);

        // 返回结果
        return {
            result: {
                data,
                metadata: {
                    query: sqlQuery,
                    total: data.length
                }
            },
            messages: newMessages
        };
    } catch (error: any) {
        return {
            result: {
                data: [],
                error: {
                    code: 'SQL_ERROR',
                    message: error.message,
                    details: error
                }
            },
            messages: newMessages
        };
    }
}