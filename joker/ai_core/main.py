from fastapi import FastAPI
from typing import List, Optional
from pydantic import BaseModel
from outline_generator import create_outline_chain
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有请求头
)

class OutlineRequest(BaseModel):
    title: str
    history: Optional[str] = None 
    focus_modules: Optional[List[str]] = None


@app.post("/generate-outline")
async def generate_outline(request: OutlineRequest):
    chain = create_outline_chain(
        title=request.title,
        history=request.history,
        focus_modules=request.focus_modules
    )
    outline = await chain.ainvoke({
        "title": request.title,
        "history_context": f"Historical reference:\n{request.history}" if request.history else "",
        "focus_context": "Focus on these modules:\n" + "\n".join(request.focus_modules) if request.focus_modules else ""
    })
    return outline

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
