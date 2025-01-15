import React from "react";
import {
  QueryResult,
  ViewProcessor,
  ViewModeDefinition,
  QueryResultView,
  ProcessedData,
} from "../types";
import { formatNumber } from "@/lib/utils";

interface MetricData {
  value: number;
  label: string;
}

const metricProcessor: ViewProcessor<MetricData> = {
  processData: (queryResult: QueryResult): ProcessedData<MetricData> => {
    try {
      if (queryResult.rows.length === 0) {
        return {
          isValid: false,
          error: "No data available",
        };
      }

      const firstRow = queryResult.rows[0];
      return {
        isValid: true,
        data: {
          value: firstRow.value as number,
          label: firstRow.label as string,
        },
      };
    } catch (error) {
      return {
        isValid: false,
        error: error,
      };
    }
  },

  validateData: (data: MetricData) => {
    if (typeof data.value !== "number") {
      return {
        isValid: false,
        error: "Metric requires a numeric value",
      };
    }
    return { isValid: true };
  },
};

const MetricView: React.FC<{ data: MetricData }> = ({ data }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] p-4">
      <div className="text-4xl font-bold mb-2">
        {formatNumber(data.value)}
      </div>
      <div className="text-lg text-gray-600">
        {data.label}
      </div>
    </div>
  );
};

export function createMetricView(
  definition: ViewModeDefinition
): QueryResultView {
  return {
    Component: MetricView,
    definition: definition,
    processor: metricProcessor,
  };
}
