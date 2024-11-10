import React from "react";
import {
  QueryResult,
  ViewProcessor,
  ViewModeDefinition,
  QueryResultView,
  ProcessedData,
} from "../types";

interface LLMViewData {
  rows: Array<{ label: string; value: any }>;
  generatedContent?: string;
}

const llmProcessor: ViewProcessor<LLMViewData> = {
  processData: (queryResult: QueryResult): ProcessedData<LLMViewData> => {
    try {
      return {
        isValid: true,
        data: {
          rows: queryResult.rows,
          // 这里可以添加生成的内容
          generatedContent: "这里将是AI生成的内容..."
        },
      };
    } catch (error) {
      return {
        isValid: false,
        error: "Failed to process data for LLM view",
      };
    }
  },

  validateData: (data: LLMViewData) => {
    if (!data.rows || !Array.isArray(data.rows)) {
      return {
        isValid: false,
        error: "Invalid data format for LLM view",
      };
    }
    return { isValid: true };
  },
};

const LLMView: React.FC<{ data: LLMViewData }> = ({ data }) => {
  return (
    <div className="w-full h-full p-4 overflow-auto">
      <div className="prose max-w-none">
        {/* 这里展示生成的内容 */}
        {data.generatedContent ? (
          <div>{data.generatedContent}</div>
        ) : (
          <div>正在生成内容...</div>
        )}
      </div>
    </div>
  );
};

export function createLLMView(
  definition: ViewModeDefinition,
): QueryResultView {
  return {
    Component: LLMView,
    definition: definition,
    processor: llmProcessor,
  };
} 