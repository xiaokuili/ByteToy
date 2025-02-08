"use server"

import { z } from "zod"
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { getDataSources } from "./datasource";


export type ContentType = 'title' | 'ai-text' | 'line-chart';

// Export the type
export type OutlineBase = {
    
    outlineID: string;
    outlineTitle: string;
    type: string;
    level: number;
    nextId?: string | null;
    

};

// Define the schema first
const outlineItemSchema: z.ZodType<OutlineBase> = z.object({
    outlineID: z.string(),
    outlineTitle: z.string(), 
    type: z.string(),
    level: z.number(),
    nextId: z.string().nullable().optional()
});

const model = new ChatOpenAI({
    model: process.env.BASE_MODEL_NAME,
    temperature: 0
});

// 基于title 和 history 生成大纲
// TODO: usehook 进行引用，然后在组件中具体传参， 我觉得应该在这里进行定义，让组件引用，因为后续入参可能是变动
export const aigenerateOutline = async (title: string, history?: string) => {
    // Get available data sources
    const dataSources = await getDataSources();
    
    const zodSchema = z.array(outlineItemSchema);
    const parser = StructuredOutputParser.fromZodSchema(zodSchema);

    // Build data sources context string
    const dataSourcesContext = dataSources.map(ds => `
        Name: ${ds.name}
        Category: ${ds.category}
        Description: ${ds.description}
        Tags: ${ds.tags.join(', ')}
    `).join('\n');
    const prompt = ChatPromptTemplate.fromTemplate(`
        为标题为"${title}"的报告生成详细大纲。

        可使用的数据源如下：
        ${dataSourcesContext}

        ${history ? `请按照以下模板结构：${history}` : `
            大纲应包含5个章节，每个章节包含3个子章节。
            每个章节需要包含ID、标题、type、nextId和level字段。
            每个章节通过nextId字段链接到下一个章节。
            每个章节需要包含level字段，表示层级深度（1表示一级标题，2表示二级标题，以此类推）。
        `}

        每个章节应包含：
        - ID和标题
        - level（层级深度）
        - 推荐的数据源（包含名称和描述）
        - 该数据源将如何在此章节中使用
        - 下一个章节的ID (nextId)

        请包含多个层级的大纲内容，每个层级包含多个章节。

        {format_instructions}
    `);

    const chain = RunnableSequence.from([
        prompt,
        model,
        parser
    ]);

    const response = await chain.invoke({
        format_instructions: parser.getFormatInstructions()
    });

    return response;
}


