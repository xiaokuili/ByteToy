import React from "react";
import {
  QueryResult,
  ViewProcessor,
  ViewModeDefinition,
  QueryResultView,
  ProcessedData,
} from "../types";
import { formatNumber } from "@/lib/utils";

interface NumberData {
  value: number;
  label?: string;
}

const numberProcessor: ViewProcessor<NumberData> = {
  processData: (queryResult: QueryResult): ProcessedData<NumberData> => {
    try {
      if (queryResult.rows.length !== 1) {
        return {
          isValid: false,
          error: "Number view requires exactly one row of data",
        };
      }

      const row = queryResult.rows[0];
      return {
        isValid: true,
        data: {
          value: row.value as number,
          label: row.label as string,
        },
      };
      // eslint-disable-next-line no-empty
    } catch (error) {
      return {
        isValid: false,
        error: error,
      };
    }
  },

  validateData: (data: NumberData) => {
    if (typeof data.value !== "number" || isNaN(data.value)) {
      return {
        isValid: false,
        error: "Number view requires a valid numeric value",
      };
    }
    if (data.label && typeof data.label !== "string") {
      return {
        isValid: false,
        error: "Label must be a string if provided",
      };
    }
    return { isValid: true };
  },
};

const NumberView: React.FC<{ data: NumberData }> = ({ data }) => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <div className='text-4xl font-bold'>{formatNumber(data.value)}</div>
      {data.label && <div className='text-lg text-gray-500'>{data.label}</div>}
    </div>
  );
};

export function createNumberView(
  definition: ViewModeDefinition
): QueryResultView {
  return {
    Component: NumberView,
    definition: definition,
    processor: numberProcessor,
  };
}
