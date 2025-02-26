"use client";

import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  return (
    <div className='flex flex-col w-full max-w-md py-24 mx-auto stretch'>
      {messages.map((m) => (
        <div
          key={m.id}
          className='whitespace-pre-wrap mb-4 p-3 rounded-lg bg-gray-100 dark:bg-zinc-800'
        >
          <strong>{m.role === "user" ? "You: " : "AI: "}</strong>
          {m.content}
        </div>
      ))}

      <form
        onSubmit={handleSubmit}
        className='fixed bottom-0 w-full max-w-md mb-8 flex'
      >
        <input
          className='flex-1 p-2 border border-zinc-300 dark:border-zinc-800 rounded-l shadow-xl 
                     dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={input}
          placeholder={isLoading ? "AI is thinking..." : "Ask something..."}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button
          type='submit'
          disabled={isLoading}
          className='px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 
                     disabled:bg-blue-300 disabled:cursor-not-allowed'
        >
          Send
        </button>
      </form>
    </div>
  );
}
