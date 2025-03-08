"use server";

import { Config, configSchema, DataRecord, ConfigGenerator, DisplayFormat } from "@/lib/types";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, Message } from "ai";
import { filterMessagesByTokenCount } from "@/lib/utils";

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

export const generateChartConfig = async (
    results: DataRecord[],
    userQuery: string,
    messages?: Message[]
) => {
    "use server";


    const userMessage: Message = {
        id: 'user',
        role: 'user',
        content: `
        You are a data visualization expert.
        Given the following data from a SQL query result, generate the chart config that best visualises the data and answers the users query.
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
      ${JSON.stringify(results, null, 2)}`
    };

    // 如果没有提供消息历史，则创建新的消息数组
    const allMessages = messages && messages.length > 0
        ? [...messages, userMessage]
        : [userMessage];
    const filterMessages = allMessages.filter(msg => ['system', 'user', 'assistant'].includes(msg.role));
    // const chatMessages = filterMessagesByTokenCount(filterMessages);
    const chatMessages = filterMessages;
    try {
        const { object: config } = await generateObject({
            model: openai("gpt-4o"),
            messages: chatMessages,
            schema: configSchema,
        });

        const colors: Record<string, string> = {};
        config.yKeys.forEach((key, index) => {
            colors[key] = `hsl(var(--chart-${index + 1}))`;
        });

        const updatedConfig: Config = { ...config, colors };

        // 创建助手回复消息
        const assistantMessage: Message = {
            id: 'assistant',
            role: 'assistant',
            content: JSON.stringify(updatedConfig)
        };
        // 返回配置和更新后的消息历史
        return {
            config: updatedConfig,
            messages: [...allMessages, assistantMessage]
        };
    } catch (e) {
        // @ts-expect-error
        console.error(e.message);
        throw new Error("Failed to generate chart suggestion");
    }
};

export const SQLConfigGenerator: ConfigGenerator = async (data: DataRecord[], query: string, messages?: Message[]) => {
    const result = await generateChartConfig(data, query, messages);

    return {
        query,
        data,
        format: "chart" as DisplayFormat,
        chartConfig: { options: result.config },
        messages: result.messages,
        isLoading: false,
        isError: false
    };
};
