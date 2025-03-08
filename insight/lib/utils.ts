import { Message } from "ai";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


/**
 * Combines multiple class names and merges Tailwind CSS classes efficiently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Filters messages to fit within a token limit using a sliding window approach.
 * Always includes the system message and most recent messages that fit.
 * 
 * @param messages Array of messages to filter
 * @param maxTokens Maximum number of tokens allowed (default 4000)
 * @returns Filtered array of messages within token limit
 */
export function filterMessagesByTokenCount(messages: Message[], maxTokens: number = 4000) {
  const chatMessages: Message[] = [];
  let totalTokens = 0;

  // Always include system message first
  const systemMsg = messages.find(msg => msg.role === 'system');
  if (systemMsg) {
    chatMessages.push(systemMsg);
    totalTokens += systemMsg.content.length; // Rough token estimate
  }

  // Add most recent messages that fit within token limit
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === 'system') continue; // Skip system message as already added

    const msgTokens = msg.content.length; // Rough token estimate
    if (totalTokens + msgTokens <= maxTokens) {
      chatMessages.unshift(msg); // Add to front to maintain order
      totalTokens += msgTokens;
    } else {
      break;
    }
  }

  return chatMessages;
}
