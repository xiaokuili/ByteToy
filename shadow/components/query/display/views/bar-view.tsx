import React from "react";
import {
  QueryResult,
  ViewProcessor,
  ViewModeDefinition,
  QueryResultView,
} from "../types";
import ReactECharts from "echarts-for-react";
import { formatNumber } from "@/lib/utils";
import { QueryErrorView } from "./error-view";

interface BarChartData {
  labels: string[];
  series: Array<{
    name: string;
    data: number[];
    type: "bar";
    label?: {
      show: boolean;
      position: "top";
    };
  }>;
}

const barProcessor: ViewProcessor = {
  processData(queryResult: QueryResult): ProcessedData {
    const { rows, columns } = queryResult;

    try {
      const labelColumn = columns[0];
      const valueColumns = columns.slice(1);

      const labels = rows.map((row) => String(row[labelColumn.name]));
      const series = valueColumns.map((valueCol) => ({
        name: valueCol.name,
        type: "bar" as const,
        data: rows.map((row) => Number(row[valueCol.name])),
        label: {
          show: true,
          position: "top" as const,
        },
      }));

      return {
        isValid: true,
        data: { labels, series },
      };
    } catch (error) {
      return {
        isValid: false,
        error: "Failed to process data for bar chart",
      };
    }
  },

  validateData(data: BarChartData) {
    if (!data.labels || !data.series || data.series.length === 0) {
      return {
        isValid: false,
        error: "Invalid data structure for bar chart",
      };
    }

    const hasValidValues = data.series.every((series) =>
      series.data.every((value) => typeof value === "number" && !isNaN(value))
    );

    if (!hasValidValues) {
      return {
        isValid: false,
        error: "All series must contain valid numeric data",
      };
    }

    return { isValid: true };
  },
};

function BarChart({ data }: { data: BarChartData }) {
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: data.series.map((s) => s.name),
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
    series: data.series,
  };

  return (
    <div className='w-full h-full min-h-[400px]'>
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
}

export function createBarView(definition: ViewModeDefinition): QueryResultView {
  return {
    Component: BarChart,
    definition,
    processor: barProcessor,
  };
}
