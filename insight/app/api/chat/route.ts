import { openai, createOpenAI } from '@ai-sdk/openai';
import { Message, streamText, createDataStreamResponse } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  // check if message.content is 2
  const is2 = messages.some(message => message.content === '2');

  if (is2) {
    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeData({ "index": messages.length, content: 'begin table' });

      },
    });
  } else {
    const result = streamText({
      model: openai('gpt-4o', {}),
      messages,
    });
    return result.toDataStreamResponse();
  }
}