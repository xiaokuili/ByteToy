from fastapi import FastAPI
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
import uuid
from outline_generator import create_outline_chain
from source_searcher import create_datasource_factory, Document


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



class SearchRequest(BaseModel):
    keyword: str
    collection_name: str

@app.post("/search")
async def search_documents(request: SearchRequest):
    try:
        # Create a data source using the factory
        data_source = create_datasource_factory("rag", collection_name=request.collection_name)
    
        # Perform the search
        results = await data_source.search(request.keyword)
        
        # Convert the results to a list of dictionaries
        formatted_results = [
            {
                "content": doc.content,
                "metadata": doc.metadata,
                "id": doc.id
            } for doc in results
        ]
        
        return {"results": formatted_results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



class AddDocumentRequest(BaseModel):
    collection_name: str
    documents: List[Document]

@app.post("/add-documents")
async def add_documents(request: AddDocumentRequest):
    for doc in request.documents:
        if "name" not in doc.metadata:
            doc.metadata["name"] = "custom"
        if "url" not in doc.metadata:
            doc.metadata["url"] = "custom"
    try:
        # Create a data source using the factory
        data_source = create_datasource_factory("rag", collection_name=request.collection_name)

        # Add the documents to the data source
        await data_source.add(request.documents)
        return {"message": f"Successfully added {len(request.documents)} documents to {request.collection_name}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
