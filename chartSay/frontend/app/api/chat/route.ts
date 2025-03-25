"use server"
import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@langchain/langgraph-sdk';


export async function POST(req: NextRequest) {
  const { question, databaseUuid } = await req.json();

  const defaultDatabaseUuid = '921c838c-541d-4361-8c96-70cb23abd9f5';

  const client = new Client({
    apiKey: process.env.LANGSMITH_API_KEY,
    apiUrl: process.env.LANGGRAPH_API_URL,
  });

  try {
    const thread = await client.threads.create();
    
    const streamResponse = client.runs.stream(thread['thread_id'], 'view_agent', {
      input: { question, uuid: databaseUuid || defaultDatabaseUuid },
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of streamResponse) {
          if (chunk.data && typeof chunk.data === 'object' && 'question' in chunk.data) {
            console.log(chunk.data);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk.data)}\n\n`));
          }
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in run:', error);
    return NextResponse.json({ message: `Error in run: ${error}` }, { status: 500 });
  }
}
