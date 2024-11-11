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

interface LineChartData {
  labels: string[];
  series: Array<{
    name: string;
    data: number[];
    type: "line";
    smooth: boolean;
    label?: {
      show: boolean;
      position: "top";
    };
  }>;
}

const lineProcessor: ViewProcessor<LineChartData> = {
  processData: (queryResult: QueryResult): ProcessedData<LineChartData> => {
    try {
      const { rows, columns } = queryResult;
      const labelColumn = columns[0];
      const valueColumns = columns.slice(1);

      const labels = rows.map((row) => String(row[labelColumn.name]));
      const series = valueColumns.map((valueCol) => ({
        name: valueCol.name,
        type: "line" as const,
        smooth: true,
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
      // eslint-disable-next-line no-empty
    } catch (error) {
      return {
        isValid: false,
        error: error,
      };
    }
  },

  validateData: (data: LineChartData) => {
    if (!data.labels || !data.series || data.series.length === 0) {
      return {
        isValid: false,
        error: "Invalid data structure for line chart",
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

const LineChart: React.FC<{ data: LineChartData }> = ({ data }) => {
  const option = {
    tooltip: {
      trigger: "axis",
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
      boundaryGap: false,
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
    <div className='w-full h-full flex-1 min-h-0'>
      <ReactECharts
        option={option}
        style={{ height: "100%", minHeight: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
};

export function createLineView(
  definition: ViewModeDefinition
): QueryResultView<LineChartData> {
  return {
    Component: LineChart,
    definition,
    processor: lineProcessor,
  };
}
