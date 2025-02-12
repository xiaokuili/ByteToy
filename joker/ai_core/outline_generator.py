from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field

from typing import List, Optional
from dotenv import load_dotenv
import os 

load_dotenv()

# output 
class OutlineItem(BaseModel):
    outline_id: str = Field(description="unique string ID for the outline item")
    outline_title: str = Field(description="section title of the outline item")
    type: str = Field(description="section type (heading/subheading/point)")
    level: int = Field(description="hierarchy level as integer")
    next_id: Optional[str] = Field(default=None, description="ID of next section")

class OutlineResponse(BaseModel):
    items: List[OutlineItem] = Field(description="List of outline items")

# interface 
def create_outline_chain(title: str, history: Optional[str] = None, focus_modules: Optional[List[str]] = None):
    """Create a chain to generate an article outline based on title, history and focus modules.
    
    Args:
        title: The title of the article
        history: Optional historical reference content
        focus_modules: Optional list of modules to focus on
        
    Returns:
        A LangChain chain that generates the outline
    """
    
    model = init_chat_model("gpt-4o-mini", model_provider="openai")
    parser = JsonOutputParser(pydantic_object=OutlineResponse)

    system_template = """You are an expert article outline generator.
    Your task is to create a detailed, well-structured outline that includes:
    - Logical structure with proper hierarchy 
    - Clear section headings
    - Key points to be covered

    {format_instructions}"""

    user_template = """Generate a detailed outline for an article with title "{title}".
    
    {history_context}
    {focus_context}"""
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_template),
        ("human", user_template)
    ]).partial(
        format_instructions=parser.get_format_instructions()
    )

    # Create and return chain
    chain = (
        prompt | 
        model |
        parser
    )

    return chain

async def main():
    # Test the outline generation
    title = "Understanding Modern Web Development"
    history = "Web development has evolved from static HTML pages to complex applications."
    focus_modules = ["Frontend", "Backend", "DevOps"]
    
    chain = create_outline_chain(
        title=title,
        history=history,  # Optional - can be None
        focus_modules=focus_modules  # Optional - can be None
    )
    
  # 修改这部分
    async for chunk in chain.astream({
        "title": title,
        "history_context": f"Historical reference:\n{history}" if history else "",
        "focus_context": "Focus on these modules:\n" + "\n".join(focus_modules) if focus_modules else ""
    }):
        print(chunk)  # 或者根据需要处理每个chunk
    


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
