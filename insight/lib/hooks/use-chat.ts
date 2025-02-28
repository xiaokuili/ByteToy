export function useChat() {
    return {
        append: async (message: string) => {
            console.log('Chat message:', message);
            // 临时返回，后续实现实际功能
            return null;
        }
    };
} 