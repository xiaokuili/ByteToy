"use client";
import React from "react";
import {
  QueryResult,
  ViewProcessor,
  ViewModeDefinition,
  QueryResultView,
  ProcessedData,
} from "../../query/display/types";
import { generateLLMResponse } from "@/lib/llm";
import { DashboardSection } from "@/types/base";
import { debounce } from "lodash";
interface LLMData {
  prompt: string;
  response: string;
}
const llmProcessor: ViewProcessor<LLMData> = {
  processData: (() => {
    const debouncedRequest = debounce(async (
      queryResult: QueryResult,
      prompt: string | undefined,
      resolve: (value: ProcessedData<LLMData>) => void
    ) => {
      try {
        const response = await generateLLMResponse({
          queryResult,
          prompt: prompt,
        });

        resolve({
          isValid: true,
          data: {
            prompt: prompt,
            response: response.content,
          },
        });
      } catch (error) {
        resolve({
          isValid: false,
          error: error,
        });
      }
    }, 500);

    return async (
      queryResult: QueryResult,
      config: DashboardSection
    ): Promise<ProcessedData<LLMData>> => {
      console.log('processData called:', {
        queryResult,
        config,
        timestamp: new Date().toISOString()
      });

      return new Promise((resolve) => {
        debouncedRequest(queryResult, config.llmConfig?.prompt, resolve);
      });
    };
  })(),

  /* eslint-disable */
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
