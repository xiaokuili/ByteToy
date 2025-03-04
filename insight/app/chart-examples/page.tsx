'use client';

import React, { useState } from 'react';
import ChartFactory from '@/components/search/charts/ChartFactory';
import { ChartConfig } from '@/lib/types';
import { chartExamples } from '@/lib/chart-examples';

/**
 * Chart Examples Page
 * Demonstrates different types of charts
 */
export default function ChartExamplesPage() {
    const [selectedChart, setSelectedChart] = useState<ChartConfig>(chartExamples.barChart);

    // All chart configurations
    const chartConfigs = [
        { name: 'Bar Chart', config: chartExamples.barChart },
        { name: 'Line Chart', config: chartExamples.lineChart },
        { name: 'Area Chart', config: chartExamples.areaChart },
        { name: 'Pie Chart', config: chartExamples.pieChart }
    ];

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Chart Examples</h1>

            {/* Chart Selector */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Select Chart Type</h2>
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

            {/* Chart Display Area */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <ChartFactory config={selectedChart} className="h-96" />
            </div>

            {/* Chart Configuration Code */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Configuration Code</h2>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
                    <code>{JSON.stringify(selectedChart, null, 2)}</code>
                </pre>
            </div>

            {/* Usage Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">How to Use</h2>
                <p className="mb-4">
                    To use charts in your component, import the ChartFactory component and required configuration:
                </p>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md mb-4">
                    <code>{`import ChartFactory from '@/components/search/charts/ChartFactory';
import { chartExamples } from '@/lib/chart-examples';

export default function MyComponent() {
  return (
    <div>
      <ChartFactory config={chartExamples.barChart} className="h-80" />
    </div>
  );
}`}</code>
                </pre>
                <p>
                    Check the <code>chart-examples.ts</code> file for more examples and how to add new chart types.
                </p>
            </div>
        </div>
    );
}