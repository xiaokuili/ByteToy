"use server";
import { Intent } from "@/lib/types";



/**
 * 识别用户查询意图
 * @param input 用户输入的查询
 * @param messages 对话历史记录
 * @returns 识别出的意图和更新后的消息
 */
export async function detectIntent(input: string): Promise<{ intent: Intent }> {
    if (input.includes("美化图表")) {
        return {
            intent: "美化图表"
        }
    }
    return {
        intent: "生成图表"
    }
}


