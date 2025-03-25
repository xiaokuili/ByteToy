import { useChatStore } from "@/hooks/useChat";

export default function ChatMessage() {
    const { messages } = useChatStore();
    
    return (
        <div className="flex flex-col space-y-4">
            {messages.map((message, index) => (
                <div 
                    key={index} 
                    className={`p-4 rounded-lg ${
                        message.role === "user" 
                            ? "bg-blue-100 self-end" 
                            : "bg-gray-100 self-start"
                    }`}
                >
                    {message.content}
                </div>
            ))}
        </div>
    );
}
