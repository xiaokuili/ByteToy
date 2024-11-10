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

interface BarChartData {
  labels: string[];
  values: number[];
}

const barProcessor: ViewProcessor<BarChartData> = {
  processData: (queryResult: QueryResult): ProcessedData<BarChartData> => {
    try {
      const labels = queryResult.rows.map(row => row.label);
      const values = queryResult.rows.map(row => row.value);

      return {
        isValid: true,
        data: { labels, values }
      };
    } catch (error) {
      return {
        isValid: false,
        error: "Failed to process data for bar chart"
      };
    }
  },

  validateData: (data: BarChartData) => {
    if (!data.labels.length || !data.values.length) {
      return { 
        isValid: false, 
        error: "Bar chart requires non-empty labels and values" 
      };
    }
    return { isValid: true };
  }
};

const BarChart: React.FC<{ data: BarChartData }> = ({ data }) => {
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: ["Bar Chart"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.labels,
      axisTick: { alignWithLabel: true },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value: number) => formatNumber(value),
      },
    },
    series: [
      {
        name: "Bar Chart",
        type: "bar",
        data: data.values,
        label: {
          show: true,
          position: "top" as const,
        },
      },
    ],
  };

  return (
    <div className='w-full h-full flex-1 min-h-0'>
      <ReactECharts
        option={option}
        style={{ height: "100%", minHeight: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
};


export function createBarChartView(
  definition: ViewModeDefinition
): QueryResultView {
  return {
    Component: BarChart,
    definition: definition,
    processor: barProcessor,
  };
}
