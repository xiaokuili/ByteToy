import React from "react";
import {
  QueryResult,
  ViewProcessor,
  ViewModeDefinition,
  QueryResultView,
  ProcessedData,
} from "../types";
import ReactECharts from "echarts-for-react";
import { formatNumber } from "@/lib/utils";

interface PieChartData {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const pieProcessor: ViewProcessor<PieChartData> = {
  processData: (queryResult: QueryResult): ProcessedData<PieChartData> => {
    try {
      const data = queryResult.rows.map((row) => ({
        name: row.label,
        value: row.value,
      }));

      return {
        isValid: true,
        data: { data },
      };
    } catch (error) {
      return {
        isValid: false,
        error: "Failed to process data for pie chart",
      };
    }
  },

  validateData: (data: PieChartData) => {
    if (!data.data.length) {
      return {
        isValid: false,
        error: "Pie chart requires non-empty data",
      };
    }
    return { isValid: true };
  },
};

const PieChart: React.FC<{ data: PieChartData }> = ({ data }) => {
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "center",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: true,
        label: {
          show: true,
          formatter: "{b}: {d}%",
        },
        data: data.data,
      },
    ],
  };

  return (
    <div className="w-full h-full flex-1 min-h-0">
      <ReactECharts
        option={option}
        style={{ height: "100%", minHeight: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
};

export function createPieChartView(
  definition: ViewModeDefinition,
): QueryResultView {
  return {
    Component: PieChart,
    definition: definition,
    processor: pieProcessor,
  };
} 