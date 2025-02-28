import { openai, createOpenAI } from '@ai-sdk/openai';
import { Message, generateText, streamText, Output } from 'ai';
import { z } from 'zod';




// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {



  const { messages }: { messages: Message[] } = await req.json();

  // 第一次访问
  const stream = await QueryBuilder(messages, ['杭州生物医药论文', '企业数据表', '女生卫生情况统计']);
  return Response.json(stream);

}


async function QueryBuilder(messages: Message[], sources: string[]) {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    baseURL: process.env.OPENAI_BASE_URL,
  });

  const { experimental_partialOutputStream } = await streamText({
    model: openai('gpt-4o-mini', {}),
    messages,
    experimental_output: Output.object({
      schema: z.object({
        isQuery: z.boolean().describe('是否需要从目前的列表中查询数据，或者是否是寻找素材的需求，这里只满足想要未完成文章寻找素材的需求， 如果是返回true， 否则返回false'),
        sourceName: z.string().describe('The name of the source， 请你从以下列表中选择一个, ' + sources.join(', ')),
        searchQueries: z.array(
          z.string().describe('A relevant search keyword or phrase')
        ).describe('List of comma-separated search queries'),
        disployMode: z.string().describe('The mode of the disploy， 指标，指标详情，图，搜索结果')
      }),
    }),
  });

  // Log the stream for debugging
  for await (const chunk of experimental_partialOutputStream) {
    console.log('Received chunk:', chunk);
  }

  return experimental_partialOutputStream;
}