"use server";

import { Config, configSchema, DBResult } from "@/lib/types";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { db } from "@/lib/db";
import { DataSource } from "@/lib/types";

export const generateQuery = async (input: string, datasource: DataSource) => {
    "use server";


    try {
        const result = await generateObject({
            model: openai("gpt-4o"),
            system: `You are a SQL (postgres) and data visualization expert. Your job is to help the user write a SQL query to retrieve the data they need. 

    Table Schema:
    ${datasource.schema}

    Example Data Format:
    ${datasource.example_data}

    Fields:
    ${datasource.special_fields}

    Query Guidelines:
    - Only retrieval (SELECT) queries are allowed
    - For string fields, use case-insensitive search with: LOWER(column) ILIKE LOWER('%term%')
    - For comma-separated list columns, trim whitespace before grouping
    - When querying specific records, include both identifier and value columns

    Data Formatting:
    - Numeric values in billions use decimal format (10.0 = $10B)
    - Rates/percentages stored as decimals (0.1 = 10%)
    - Time-based analysis should group by year

    Visualization Requirements:
    - Every query must return data suitable for charts (minimum 2 columns)
    - Single column requests should include count/frequency
    - Rate queries should return decimal values
    - Include appropriate grouping columns for visualization context
    `,
            prompt: `Generate the query necessary to retrieve the data the user wants: ${input}`,
            schema: z.object({
                query: z.string(),
            }),
        });
        return result.object.query;
    } catch (e) {
        console.error(e);
        throw new Error("Failed to generate query");
    }
};
export const runGenerateSQLQuery = async (query: string) => {
    "use server";
    // Check if the query is a SELECT statement
    if (
        !query.trim().toLowerCase().startsWith("select") ||
        query.trim().toLowerCase().includes("drop") ||
        query.trim().toLowerCase().includes("delete") ||
        query.trim().toLowerCase().includes("insert") ||
        query.trim().toLowerCase().includes("update") ||
        query.trim().toLowerCase().includes("alter") ||
        query.trim().toLowerCase().includes("truncate") ||
        query.trim().toLowerCase().includes("create") ||
        query.trim().toLowerCase().includes("grant") ||
        query.trim().toLowerCase().includes("revoke")
    ) {
        throw new Error("Only SELECT queries are allowed");
    }

    let data: any;
    try {
        data = await db.execute(query);
    } catch (e: any) {
        if (e.message.includes('relation "unicorns" does not exist')) {
            console.log(
                "Table does not exist, creating and seeding it with dummy data now...",
            );
            // throw error 
            throw Error("Table does not exist");
        } else {
            throw e;
        }
    }

    return data as DBResult[];
};

export const generateChartConfig = async (
    results: DBResult[],
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
        // @ts-expect-errore
        console.error(e.message);
        throw new Error("Failed to generate chart suggestion");
    }
};