"use server";
import { Intent, intentSchema } from "@/lib/types";
import { generateObject, Message } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// OpenAI客户端配置
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

/**
 * 识别用户查询意图
 * @param input 用户输入的查询
 * @param messages 对话历史记录
 * @returns 识别出的意图和更新后的消息
 */
export async function detectIntent(input: string, messages?: Message[]): Promise<{ intent: Intent, messages: Message[] }> {
    try {
        const systemMessage: Message = {
            id: "system",
            role: "system",
            content: `你是一个数据可视化专家，基于用户的输入，判断用户意图并返回以下类型之一:

如果用户描述要需要获取或查询数据，返回:
- sql: 需要执行SQL查询获取数据

如果用户在描述图表展示样式，返回用户需要的图表类型之一:
- bar: 柱状图
- line: 折线图
- pie: 饼图
- area: 面积图
- radar: 雷达图
- funnel: 漏斗图
- heatmap: 热力图

如果不属于以上任何类型，返回:
- no

只返回类型名称，不要包含任何其他文字。`
        };

        const userMessage: Message = {
            id: 'user',
            role: 'user',
            content: input
        };

        const allMessages = messages ? [...messages, userMessage] : [systemMessage, userMessage];

        const result = await generateObject({
            model: openai("gpt-3.5-turbo"),
            messages: allMessages,
            schema: intentSchema,
        });

        const intentMessage: Message = {
            id: "intent",
            role: "assistant",
            content: result.object.intent,
            type: "intent"
        } as Message
        console.log("intent", result.object);
        return {
            intent: result.object,
            messages: [...allMessages, intentMessage]
        };

    } catch (e) {
        throw new Error("Failed to detect intent: " + (e as Error).message);
    }
}
