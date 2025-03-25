import { create } from 'zustand';

export interface Message {
  content: string;
  role: 'user' | 'assistant';
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  submitQuestion: (question: string, uuid: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  
  submitQuestion: async (question: string, uuid: string) => {
    set({ isLoading: true, error: null });
    
    const userMessage: Message = { content: question, role: 'user' };
    set(state => ({ 
      messages: [...state.messages, userMessage] 
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, uuid }),
      });

      if (!response.ok) {
        throw new Error('Run failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is empty');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            accumulatedContent += data;
            
            set(state => {
              const prevMessages = state.messages;
              const lastMessage = prevMessages[prevMessages.length - 1];
              
              if (lastMessage && lastMessage.role === 'assistant') {
                return {
                  messages: [
                    ...prevMessages.slice(0, -1),
                    { ...lastMessage, content: accumulatedContent }
                  ]
                };
              } else {
                return {
                  messages: [
                    ...prevMessages,
                    { content: accumulatedContent, role: 'assistant' }
                  ]
                };
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  clearMessages: () => set({ messages: [] }),
}));

// 为了向后兼容，保留原始的 hook 接口
export const useChat = () => {
  const { messages, isLoading, error, submitQuestion, clearMessages } = useChatStore();
  return { messages, submitQuestion, isLoading, error, clearMessages };
};
