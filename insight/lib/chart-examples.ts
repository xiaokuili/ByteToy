import { ChartConfig } from "@/lib/types";

// Sample data for charts
const sampleTimeSeriesData = [
    { date: "2023-01", value: 400, category: "Product A" },
    { date: "2023-02", value: 300, category: "Product A" },
    { date: "2023-03", value: 500, category: "Product A" },
    { date: "2023-04", value: 280, category: "Product A" },
    { date: "2023-05", value: 590, category: "Product A" },
    { date: "2023-01", value: 300, category: "Product B" },
    { date: "2023-02", value: 400, category: "Product B" },
    { date: "2023-03", value: 350, category: "Product B" },
    { date: "2023-04", value: 450, category: "Product B" },
    { date: "2023-05", value: 600, category: "Product B" },
];

const samplePieData = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
    { name: "Group E", value: 100 },
];

// Chart examples
export const chartExamples: Record<string, ChartConfig> = {
    lineChart: {
        chartData: sampleTimeSeriesData,
        options: {
            type: "line",
            title: "Monthly Sales Trend",
            description: "Shows monthly sales trends for Product A and B",
            takeaway: "Product B shows stronger growth over time",
            xKey: "date",
            yKeys: ["value"],
            multipleLines: true,
            measurementColumn: "value",
            lineCategories: ["Product A", "Product B"],
            legend: true
        }
    },

    areaChart: {
        chartData: sampleTimeSeriesData,
        options: {
            type: "area",
            title: "Revenue by Product",
            description: "Shows revenue distribution between products",
            takeaway: "Both products show positive revenue trends",
            xKey: "date",
            yKeys: ["value"],
            multipleLines: true,
            measurementColumn: "value",
            lineCategories: ["Product A", "Product B"],
            legend: true
        }
    },

    pieChart: {
        chartData: samplePieData,
        options: {
            type: "pie",
            title: "Market Share Distribution",
            description: "Shows market share across different groups",
            takeaway: "Group A has the largest market share",
            xKey: "name",
            yKeys: ["value"],
            legend: true
        }
    },

    barChart: {
        chartData: [
            { quarter: "Q1", sales: 400, profit: 200 },
            { quarter: "Q2", sales: 500, profit: 250 },
            { quarter: "Q3", sales: 600, profit: 300 },
            { quarter: "Q4", sales: 700, profit: 350 },
        ],
        options: {
            type: "bar",
            title: "Quarterly Performance",
            description: "Compares sales and profit by quarter",
            takeaway: "Both sales and profit show steady growth",
            xKey: "quarter",
            yKeys: ["sales", "profit"],
            legend: true
        }
    }
};

// Function to get a specific chart example
export function getChartExample(key: string): ChartConfig | undefined {
    return chartExamples[key];
}

// Function to get all chart examples
export function getAllChartExamples(): ChartConfig[] {
    return Object.values(chartExamples);
}