
"use client"
import ChatComposer from "@/components/chat/ChatComposer"
import ChatThread from "@/components/chat/ChatThread"

export default  function Page() {
    return (
        <div>
            <h1>Chat</h1>
            <ChatThread />

            <ChatComposer />
        </div>
    )
  }