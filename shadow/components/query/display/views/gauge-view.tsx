import React from "react";
import {
  QueryResult,
  ViewProcessor,
  ViewModeDefinition,
  QueryResultView,
  ProcessedData,
} from "../types";
import { formatNumber } from "@/lib/utils";
import ReactECharts from 'echarts-for-react';

interface GaugeData {
  value: number;
  label: string;
}

const gaugeProcessor: ViewProcessor<GaugeData> = {
  processData: (queryResult: QueryResult): ProcessedData<GaugeData> => {
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

  validateData: (data: GaugeData) => {
    if (typeof data.value !== "number") {
      return {
        isValid: false,
        error: "Metric requires a numeric value",
      };
    }
    return { isValid: true };
  },
};

const GaugeView: React.FC<{ data: GaugeData }> = ({ data }) => {
  const option = {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          width: 6,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '12%',
        width: 20,
        offsetCenter: [0, '-60%'],
        itemStyle: {
          color: 'auto'
        }
      },
      axisTick: {
        length: 12,
        lineStyle: {
          color: 'auto',
          width: 2
        }
      },
      splitLine: {
        length: 20,
        lineStyle: {
          color: 'auto',
          width: 5
        }
      },
      axisLabel: {
        color: '#464646',
        fontSize: 20,
        distance: -60,
        formatter: function (value: number) {
          if (value === 0.875) {
            return '';
          }
          return value;
        }
      },
      title: {
        offsetCenter: [0, '-20%'],
        fontSize: 20
      },
      detail: {
        fontSize: 30,
        offsetCenter: [0, '0%'],
        valueAnimation: true,
        formatter: function (value: number) {
          return value.toFixed(2);
        },
        color: 'auto'
      },
      data: [{
        value: data.value,
        name: data.label
      }]
    }]
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <ReactECharts option={option} style={{height: '100%', width: '100%'}} />
    </div>
  );
};

export function createGaugeView(
  definition: ViewModeDefinition
): QueryResultView {
  return {
    Component: GaugeView,
    definition: definition,
    processor: gaugeProcessor,
  };
}
