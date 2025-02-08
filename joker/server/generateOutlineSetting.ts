

"use server"

import { eq, and } from "drizzle-orm"
import db from "@/lib/drizzle"
import { outlineItems } from "@/schema"
import { z } from "zod"
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { getDataSources } from "./datasource";



export interface GenerateConfig {
    // 生成类型  bar等
    generationType: string
     // 生成历史样例
     example: string[]
     // 描述
     description: string
}
  
export interface DataConfig {
    id: string;
    name: string;
    category?: string;
    description?: string;
    input?: string;
    output?: string;
    tags?: string[];
    status?: string;
  }


export async function dbgenerateDataConfig(reportId: string, outlineId: string) {
    const setting = await db.select()
        .from(outlineItems)
        .where(
            and(
                eq(outlineItems.reportId, reportId),
                eq(outlineItems.id, outlineId)
            )
        )
        .limit(1);

    return setting[0]?.dataConfig as DataConfig[];
}


const model = new ChatOpenAI({
    model: process.env.BASE_MODEL_NAME,
    temperature: 0
});

// 基于report_title 和 outline_title 以及data_sources 生成数据源
export async function aigenerateDataConfig({report_title,  outline_title} : {report_title: string, outline_title: string}) {
    const data_srouces = await getDataSources()
    const prompt = ChatPromptTemplate.fromTemplate(`
        为标题为"${report_title}"的报告，使用模板"${outline_title}"，推荐需要绑定的数据源。

        可使用的数据源如下：
        ${data_srouces.map(ds => `
            Name: ${ds.name}
            Category: ${ds.category || ''}
            Description: ${ds.description || ''}
            Tags: ${ds.tags?.join(', ') || ''}
        `).join('\n')}

        请推荐最适合的数据源，并返回以下格式:
        - id: 数据源ID
        - name: 数据源名称 
        - category: 数据源分类
        - description: 数据源描述
        - input: 输入格式
        - output: 输出格式
        - tags: 标签列表
        - status: 状态

        {format_instructions}
    `);

    const zodSchema = z.array(z.object({
        id: z.string(),
        name: z.string(),
        category: z.string().optional(),
        description: z.string().optional(),
        input: z.string().optional(),
        output: z.string().optional(),
        tags: z.array(z.string()).optional(),
        status: z.string().optional()
    }));

    const parser = StructuredOutputParser.fromZodSchema(zodSchema);
   
    const chain = RunnableSequence.from([
        prompt,
        model,
        parser
    ]);

    const response = await chain.invoke({
        format_instructions: parser.getFormatInstructions()
    });

    return response as DataConfig[];
}