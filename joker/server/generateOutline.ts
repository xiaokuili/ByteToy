"use server"

import { z } from "zod"
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { prisma } from "@/lib/prisma"
export async function getDataSources() {
  const dataSources = await prisma.dataSource.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      input: true,
      output: true,
      tags: true,
      status: true
    },
    where: {
      status: 'active'
    }
  })
  return dataSources
}



export type ContentType = 'title' | 'ai-text' | 'line-chart';


// Export the type
export type OutlineItem = {
    id: string;
    title: string;
    type?: 'title' | 'ai-text' | 'line-chart';
    children?: OutlineItem[];
    data?: Array<{
        name: string;
        description: string;
    }>;
};
// Define the schema first
const outlineItemSchema: z.ZodType<OutlineItem> = z.object({
    id: z.string(),
    title: z.string(), 
    type: z.enum(['title', 'ai-text', 'line-chart'] as const).optional(),
    children: z.array(z.lazy(() => outlineItemSchema)).optional(),
    data: z.array(z.object({
        name: z.string(),
        description: z.string()
    })).optional()
});



const model = new ChatOpenAI({
    model: process.env.BASE_MODEL_NAME,
    temperature: 0
});

export const generateOutline = async (title: string, template?: string) => {
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

        ${template ? `请按照以下模板结构：${template}` : `
            大纲应包含5个章节，每个章节包含3个子章节。
            每个章节需要包含ID和标题。
        `}

        对每个章节，请从上述可用数据源中推荐相关的数据源。
        根据数据源的标签、类别和描述进行匹配。

        每个章节应包含：
        - ID和标题
        - 推荐的数据源（包含名称和描述）
        - 该数据源将如何在此章节中使用

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
