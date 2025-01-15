"use server";

import OpenAI from "openai";
import { QueryResult } from "../components/query/display/types";

export interface LLMResponse {
  content: string;
  error?: string;
}

export interface LLMRequest {
  queryResult: QueryResult;
  prompt?: string;
}

export async function generateLLMResponse(
  request: LLMRequest
): Promise<LLMResponse> {
  try {
    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是一个写作助手.",
        },
        {
          role: "user",
          content: `${request.prompt}  \n\n 数据:  ${JSON.stringify(
            request.queryResult
          )} `,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    return {
      content: completion.choices[0].message.content || "",
    };
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    return {
      content: "Sorry, I encountered an error while analyzing the data.",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
