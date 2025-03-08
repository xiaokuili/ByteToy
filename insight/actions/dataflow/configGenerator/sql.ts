"use server";

import { Config, configSchema, DataRecord, ConfigGenerator, DisplayFormat } from "@/lib/types";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

export const generateChartConfig = async (
    results: DataRecord[],
    userQuery: string,
) => {
    "use server";
    const system = `You are a data visualization expert. `;

    try {
        const { object: config } = await generateObject({
            model: openai("gpt-4o"),
            system,
            prompt: `Given the following data from a SQL query result, generate the chart config that best visualises the data and answers the users query.
      For multiple groups use multi-lines.

      Here is an example complete config:
      export const chartConfig = {
        type: "pie",
        xKey: "month",
        yKeys: ["sales", "profit", "expenses"],
        colors: {
          sales: "#4CAF50",    // Green for sales
          profit: "#2196F3",   // Blue for profit
          expenses: "#F44336"  // Red for expenses
        },
        legend: true
      }

      User Query:
      ${userQuery}

      Data:
      ${JSON.stringify(results, null, 2)}`,
            schema: configSchema,
        });

        const colors: Record<string, string> = {};
        config.yKeys.forEach((key, index) => {
            colors[key] = `hsl(var(--chart-${index + 1}))`;
        });

        const updatedConfig: Config = { ...config, colors };
        return { config: updatedConfig };
    } catch (e) {
        // @ts-expect-error
        console.error(e.message);
        throw new Error("Failed to generate chart suggestion");
    }
};

export const SQLConfigGenerator: ConfigGenerator = async (data: DataRecord[], query: string) => {
    const { config } = await generateChartConfig(data, query);

    return {
        query,
        data,
        format: "chart" as DisplayFormat,
        chartConfig: { options: config },
        isLoading: false,
        isError: false
    };
};
