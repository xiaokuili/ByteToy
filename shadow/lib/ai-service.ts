'use server';  
import { QueryResult } from "../components/query/display/types";
import OpenAI from "openai";

export interface AIGenerateResponse {
  content: string;
  error?: string;
}

export interface AIGenerateRequest {
  queryResult: QueryResult;
  prompt?: string;
}

export async function generateQueryResult(
  request: AIGenerateRequest
): Promise<AIGenerateResponse> {
 
  try {
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates query results."
        },
        {
          role: "user",
          content: `Please analyze this data: ${JSON.stringify(request.queryResult)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return {
      content: completion.choices[0].message.content || ""
    };

  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    return {
      content: "Sorry, I encountered an error while analyzing the data.",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}