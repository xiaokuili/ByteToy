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
      console.log("config", config);
      const response = await generateLLMResponse({
        queryResult,
        prompt: config.llmConfig?.prompt,
      });
      
      console.log("response", response);
      return {
        isValid: true,
        data: {
          prompt: config.llmConfig?.prompt,
          response: response.content,
        },
      };
    } catch (error) {
      return {
        isValid: false,
        error: "asdfasdf",
      };
    }
  },

  validateData: (data: LLMData) => {

    return { isValid: true };
  },
};

const LLMView: React.FC<{ data: LLMData }> = ({ data }) => {
  return (
    <div className='w-full h-full flex-1 min-h-0 p-4'>
     
      <div>
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
