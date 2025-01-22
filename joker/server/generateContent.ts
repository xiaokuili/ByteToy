"use server"

import {  OutlineItem } from "./generateOutline"
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

// 方案1: 都返回 Promise<AsyncIterable>
const textGenerators = {
    'title': async function* (title: string) {
        yield `<h2>${title}</h2>`;
    },
    'ai-text': async function* (title: string, shouldStop = { value: false }) {
        const chat = new ChatOpenAI({
            model: process.env.BASE_MODEL_NAME,
            temperature: 0,
            streaming: true
        });
        const prompt = ChatPromptTemplate.fromTemplate(
            "请写一段关于{title}的内容，大约50个汉字左右。内容要简洁明了，语言要专业"
        );
        const chain = RunnableSequence.from([prompt, chat]);
        const stream = await chain.stream({ title });

        for await (const chunk of stream) {
            if (shouldStop.value) break;

            if (typeof chunk === 'object' && 'content' in chunk) {
                yield chunk.content;
            } else if (typeof chunk === 'string') {
                yield chunk;
            }
        }
    },
    'line-chart': async function* (title: string) {
        // Create chart configuration
        const configuration = {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: title,
                    data: [12, 19, 3, 5, 2, 3],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            }
        };

        // Use QuickChart API to generate chart
        const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(configuration))}`;

        // Return chart URL in TipTap compatible format
        const imageHtml = `<img src="${chartUrl}" alt="Chart" /> <p></p>`;
        yield imageHtml;
    },

};

export const generateText = async function* (outline: OutlineItem) {
    const generator = textGenerators[outline?.type as keyof typeof textGenerators]
    if (!generator) {
        yield outline.title;
        return;
    }

    const stream = await generator(outline.title);

    for await (const chunk of stream) {
        yield chunk
    }
}
