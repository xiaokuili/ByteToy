import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";





interface GenerateTextProps {
    report_title: string;
    outline_title: string;
    example: string[];
    data: string;
}

export async function generateText(props: GenerateTextProps) {
    const model = new ChatOpenAI({
        model: process.env.BASE_MODEL_NAME,
        temperature: 0
    });

    const prompt = ChatPromptTemplate.fromTemplate(`
        为标题为"${props.report_title}"的报告，使用模板"${props.outline_title}"，生成内容。

        历史样例:
        ${props.example.map(ex => `- ${ex}`).join('\n')}
        
        数据:
        ${props.data}

        请生成合适的内容，并返回以下格式:
        - content: 生成的内容
        - type: 内容类型
        - metadata: 元数据

        {format_instructions}
    `);

    const zodSchema = z.object({
        content: z.string(),
        type: z.string(),
        metadata: z.record(z.any())
    });

    const parser = StructuredOutputParser.fromZodSchema(zodSchema);

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



