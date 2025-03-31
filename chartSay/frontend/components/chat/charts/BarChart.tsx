import React from 'react'
import ReactECharts from 'echarts-for-react';  // or var ReactECharts = require('echarts-for-react');

export interface BarGraphProps {
  data: {
    labels: string[]
    values: { data: number[]; label: string }[]
  }
}


// 整个都需要复制 exampleData
export const exampleData: BarGraphProps = {
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [
      { data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3], label: 'Precipitation' },
      { data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3], label: 'Temperature' }
    ]
  }
}

export const exampleData2: BarGraphProps = {
  data: {
    labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
    values: [
      { data: [120, 200, 150, 80, 70], label: 'Series 1' },
      { data: [60, 80, 70, 120, 90], label: 'Series 2' }
    ]
  }
}

const BarGraph: React.FC<BarGraphProps> = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: data.values.map(series => series.label)
    },
    xAxis: {
      type: 'category',
      data: data.labels
    },
    yAxis: {
      type: 'value'
    },
    series: data.values.map(series => ({
      name: series.label,
      type: 'bar',
      data: series.data
    }))
  }

  return <ReactECharts  option={option} style={{ height: '300px' }} />
}

export default BarGraph
