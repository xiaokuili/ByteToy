

import { openai,createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    baseURL: process.env.OPENAI_BASE_URL,
  });
  const result = streamText({
    model: openai('gpt-4o', { }),
    messages,
  });

  return result.toDataStreamResponse();
}