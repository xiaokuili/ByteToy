'use server';

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';

export async function generate(input: string) {
  const stream = createStreamableValue();

  setTimeout(() => {
    stream.update('thread.run.create');
    stream.done();
  }, 1000);

  return { output: stream.value };
}