import React from "react";
import {
  QueryResult,
  ViewProcessor,
  ViewModeDefinition,
  QueryResultView,
  ProcessedData,
} from "../../query/display/types";
import { DashboardConfig } from "../types";
import { generateLLMResponse } from "@/lib/llm";

interface LLMData {
  prompt: string;
  response: string;
}

const llmProcessor: ViewProcessor<LLMData> = {
  processData: async (
    queryResult: QueryResult,
    config: DashboardConfig
  ): Promise<ProcessedData<LLMData>> => {
    try {
      // Assume first row contains prompt in 'prompt' column
      // console.log("config", config);
      // const response = await generateLLMResponse({
      //   queryResult,
      //   prompt: config.llmConfig?.prompt,
      // });
      console.log("queryResult", queryResult);
      console.log("config", config);
      return {
        isValid: true,
        data: { prompt: "asdfasdf", response: "asdfasdf" },
      };
    } catch (error) {
      return {
        isValid: false,
        error: "asdfasdf",
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
