from langchain_core.prompts import ChatPromptTemplate
from langchain_deepseek import ChatDeepSeek
from dotenv import load_dotenv
import os

load_dotenv()

class LLMManager:
    def __init__(self):
        self.llm = ChatDeepSeek(model=os.getenv("BASE_MODEL_NAME"), api_base=os.getenv("DEEPSEEK_BASE_URL"), temperature=0)

    def invoke(self, prompt: ChatPromptTemplate, **kwargs) -> str:
        messages = prompt.format_messages(**kwargs)
        response = self.llm.invoke(messages)
        return response.content