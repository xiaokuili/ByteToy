import React from "react";
import {
  QueryResult,
  ViewProcessor,
  ViewModeDefinition,
  QueryResultView,
  ProcessedData,
} from "../../query/display/types";
import OpenAI from "openai";

interface LLMData {
  prompt: string;
  response: string;
}

const llmProcessor: ViewProcessor<LLMData> = {
  processData: async (
    queryResult: QueryResult
  ): Promise<ProcessedData<LLMData>> => {
    try {
      // Assume first row contains prompt in 'prompt' column
      const prompt = queryResult.rows[0].prompt as string;

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      const completion = await openai.createChatCompletion({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
      });

      const response = completion.data.choices[0].message?.content || "";

      return {
        isValid: true,
        data: { prompt, response },
      };
    } catch (error) {
      return {
        isValid: false,
        error: String(error),
      };
    }
  },

  validateData: (data: LLMData) => {
    if (!data.prompt || !data.response) {
      return {
        isValid: false,
        error: "LLM view requires both prompt and response",
      };
    }
    return { isValid: true };
  },
};

const LLMView: React.FC<{ data: LLMData }> = ({ data }) => {
  return (
    <div className='w-full h-full flex-1 min-h-0 p-4'>
      <div className='mb-4'>
        <h3 className='font-medium mb-2'>Prompt:</h3>
        <div className='bg-muted p-3 rounded'>{data.prompt}</div>
      </div>
      <div>
        <h3 className='font-medium mb-2'>Response:</h3>
        <div className='bg-muted p-3 rounded whitespace-pre-wrap'>
          {data.response}
        </div>
      </div>
    </div>
  );
};

export function createLLMView(definition: ViewModeDefinition): QueryResultView {
  return {
    Component: LLMView,
    definition: definition,
    processor: llmProcessor,
  };
}
