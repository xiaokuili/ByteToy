"use client";
import React, { useEffect, useState } from "react";
import {
  QueryResult,
  ViewProcessor,
  ViewModeDefinition,
  QueryResultView,
  ProcessedData,
} from "../types";
import { generateQueryResult } from "@/lib/ai-service";

interface LLMViewData {
  rows: Array<{ label: string; value: any }>;
  queryResult: QueryResult;
  generatedContent?: string;
}

const llmProcessor: ViewProcessor<LLMViewData> = {
  processData: (queryResult: QueryResult): ProcessedData<LLMViewData> => {
    try {
      return {
        isValid: true,
        data: {
          rows: queryResult.rows,
          queryResult,
          generatedContent: undefined
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
  const [content, setContent] = useState<string | undefined>(data.generatedContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchAIAnalysis = async () => {
      setLoading(true);
      try {
        const response = await generateQueryResult({
          queryResult: data.queryResult,
        });
        setContent(response.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "分析失败");
      } finally {
        setLoading(false);
      }
    };

    if (!content) {
      fetchAIAnalysis();
    }
  }, [data.queryResult, content]);

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <div className="prose max-w-none">
        {loading ? (
          <div>正在生成分析...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : content ? (
          <div>{content}</div>
        ) : (
          <div>等待分析...</div>
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