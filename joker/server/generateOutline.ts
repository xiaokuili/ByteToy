"use server"

import { z } from "zod"
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

export type ContentType = 'title' | 'paragraph' | 'line-chart' | 'bar-chart' | 'pie-chart';

export interface OutlineItem {
    id: string
    title: string
    type?: ContentType
    children?: OutlineItem[]
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
        type: z.enum(['title', 'paragraph', 'line-chart', 'bar-chart', 'pie-chart']).optional(),
        children: z.array(z.object({
            id: z.string(),
            title: z.string(),
            type: z.enum(['title', 'paragraph', 'line-chart', 'bar-chart', 'pie-chart']).optional()
        })).optional()
    }));

    const parser = StructuredOutputParser.fromZodSchema(zodSchema);

    const prompt = ChatPromptTemplate.fromTemplate(`
        Generate a detailed outline for a report titled "${title}".
        The outline should have 5 chapters with 3 subsections each.
        Each section needs an ID and title.
        
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
