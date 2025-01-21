"use server"

import { z } from "zod"
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

export type ContentType = 'title' | 'ai-text' | 'line-chart';

export interface ReportData {
    name: string;
    description: string;
    args: Record<string, string>;
    return?: Record<string, string>[];
}

export interface OutlineItem {
    id: string
    title: string
    type?: ContentType
    children?: OutlineItem[]
    data?: ReportData[]
}

const model = new ChatOpenAI({

    model: process.env.BASE_MODEL_NAME,
    temperature: 0
});


export const generateOutline = async (title: string) => {
    // Import required dependencies from langchain
    const zodSchema = z.array(z.object({
        id: z.string(),
        title: z.string(),
        type: z.enum(['title', 'ai-text', 'line-chart'] as const).optional(),
        data: z.array(z.object({
            name: z.string(),
            description: z.string(),
            args: z.record(z.string(), z.string()),
            return: z.record(z.string(), z.string()).optional()
        })).optional(),
        children: z.array(z.object({
            id: z.string(),
            title: z.string(),
            type: z.enum(['title', 'ai-text', 'line-chart']).optional(),
            data: z.array(z.object({
                name: z.string(),
                description: z.string(),
                args: z.record(z.string(), z.string()),
                return: z.record(z.string(), z.string()).optional()
            })).optional()
        })).optional()
    }));

    const parser = StructuredOutputParser.fromZodSchema(zodSchema);

    const prompt = ChatPromptTemplate.fromTemplate(`
        Generate a detailed outline for a report titled "${title}".
        The outline should have 5 chapters with 3 subsections each.
        Each section needs an ID and title.
        Each section can have a data source, which is a list of data sources that can be used to generate the section.
        Each data source needs a name, description, args, and return.

        please mock some data source for example:

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
    console.log(response)
    return response;
}
