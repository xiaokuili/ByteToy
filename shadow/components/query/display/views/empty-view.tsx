import React from "react";
import {
  QueryResult,
  ViewProcessor,
  ViewModeDefinition,
  QueryResultView,
  ProcessedData,
} from "../types";

interface EmptyData {
  message: string;
}

const emptyProcessor: ViewProcessor<EmptyData> = {
  /* eslint-disable */
  processData: (queryResult: QueryResult): ProcessedData<EmptyData> => {
    try {
      return {
        isValid: true,
        data: { message: "No data available" },
      };
    } catch (error) {
      return {
        isValid: false,
        error: error,
      };
    }
  },

  validateData: (data: EmptyData) => {
    if (!data.message) {
      return {
        isValid: false,
        error: "Empty view requires a message",
      };
    }
    return { isValid: true };
  },
};

const EmptyView: React.FC<{ data: EmptyData }> = ({ data }) => {
  return (
    <div className='w-full h-full flex-1 min-h-0 flex items-center justify-center'>
      <div className='text-muted-foreground'>{data.message}</div>
    </div>
  );
};

export function createEmptyView(definition: ViewModeDefinition): QueryResultView {
  return {
    Component: EmptyView,
    definition: definition,
    processor: emptyProcessor,
  };
}
