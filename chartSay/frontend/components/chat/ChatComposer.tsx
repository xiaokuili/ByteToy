import { useState } from "react"
import { useChat } from "@/hooks/useChat"

export default function ChatComposer() {
    const [question, setQuestion] = useState("")
    const { submitQuestion } = useChat()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(e.target.value)
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        submitQuestion(question, "921c838c-541d-4361-8c96-70cb23abd9f5")
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="text"  onChange={handleChange} className="border-2 border-gray-300 rounded-md p-2" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md cursor-pointer">Submit</button>
        </form>
    )
}
