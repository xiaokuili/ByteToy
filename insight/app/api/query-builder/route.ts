import { createOpenAI } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { queryBuilderSchema } from './schema';

// Allow streaming responses up to 30 seconds 
export const maxDuration = 30;

export async function POST(req: Request) {
    const context = await req.json();

    const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
        baseURL: process.env.OPENAI_BASE_URL,
    });
    const result = streamObject({
        model: openai('gpt-4-turbo'),
        schema: queryBuilderSchema,
        prompt:
            `Based on this user message, generate a query configuration:
      
      User message: ${context}
      
      Generate a query configuration that specifies:
      1. Which data source to query from
      2. Search terms to filter the results
      3. How to display the results (metrics, details, chart, or search)
      
      Format the response according to the schema.`
    });

    return result.toTextStreamResponse();
}
