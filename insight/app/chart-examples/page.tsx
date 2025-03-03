'use client';

import React, { useState } from 'react';
import ChartFactory from '@/components/search/charts/ChartFactory';
import {
    barChartConfig,
    lineChartConfig,
    pieChartConfig,
    donutChartConfig,
    scatterChartConfig,
    radarChartConfig
} from '@/components/search/charts/ChartExamples';
import { ChartConfig } from '@/components/search/charts/ChartTypes';

/**
 * 图表示例页面
 * 展示各种图表类型的示例
 */
export default function ChartExamplesPage() {
    const [selectedChart, setSelectedChart] = useState<ChartConfig>(barChartConfig);

    // 所有图表配置
    const chartConfigs = [
        { name: '柱状图', config: barChartConfig },
        { name: '折线图', config: lineChartConfig },
        { name: '饼图', config: pieChartConfig },
        { name: '环形图', config: donutChartConfig },
        { name: '散点图', config: scatterChartConfig },
        { name: '雷达图', config: radarChartConfig }
    ];

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">图表示例</h1>

            {/* 图表选择器 */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">选择图表类型</h2>
                <div className="flex flex-wrap gap-2">
                    {chartConfigs.map((item, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 rounded-md ${selectedChart === item.config
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                                }`}
                            onClick={() => setSelectedChart(item.config)}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* 图表展示区域 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <ChartFactory config={selectedChart} className="h-96" />
            </div>

            {/* 图表配置代码 */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">配置代码</h2>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
                    <code>{JSON.stringify(selectedChart, null, 2)}</code>
                </pre>
            </div>

            {/* 使用说明 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">如何使用</h2>
                <p className="mb-4">
                    要在你的组件中使用图表，只需导入 ChartFactory 组件和所需的配置：
                </p>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md mb-4">
                    <code>{`import ChartFactory from '@/components/search/charts/ChartFactory';
import { barChartConfig } from '@/components/search/charts/ChartExamples';

export default function MyComponent() {
  return (
    <div>
      <ChartFactory config={barChartConfig} className="h-80" />
    </div>
  );
}`}</code>
                </pre>
                <p>
                    查看 <code>ChartExamples.ts</code> 文件了解更多示例和如何添加新的图表类型。
                </p>
            </div>
        </div>
    );
} 