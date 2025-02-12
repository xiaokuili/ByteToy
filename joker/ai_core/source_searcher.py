from typing import Protocol, List, Dict, Any
from dataclasses import dataclass

@dataclass
class Document:
    """文档数据结构"""
    content: str
    metadata: Dict[str, Any]

class DataSource(Protocol):
    """数据源接口"""
    async def search(self, query: str) -> List[Document]: ...
    async def get_by_id(self, doc_id: str) -> Document: ...

class RAGDataSource:
    """RAG实现的数据源"""
    def __init__(self, collection_name: str):
        self.collection_name = collection_name
        
    async def search(self, query: str) -> List[Document]:
        from chromadb import Client, Settings
        from chromadb.utils import embedding_functions
        
        # 初始化 ChromaDB 客户端
        client = Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory="./chroma_db"
        ))
        
        # 使用 BGE 嵌入模型
        bge_ef = embedding_functions.HuggingFaceEmbeddingFunction(
            model_name="BAAI/bge-small-zh", # 使用中文模型
            device="cpu"
        )
        
        # 获取或创建集合
        collection = client.get_or_create_collection(
            name=self.collection_name,
            embedding_function=bge_ef
        )
        
        # 执行相似度搜索
        results = collection.query(
            query_texts=[query],
            n_results=5
        )
        
        # 转换为Document格式
        documents = []
        if results and results['documents']:
            for doc, metadata in zip(results['documents'][0], results['metadatas'][0]):
                documents.append(Document(
                    content=doc,
                    metadata=metadata
                ))
                
        return documents
    
    async def get_by_id(self, doc_id: str) -> Document:
        # TODO: 实现文档获取
        return Document(content="", metadata={})

def create_datasource_factory(source_type: str = "rag", **kwargs) -> DataSource:
    """创建数据源的工厂函数
    
    Args:
        source_type: 数据源类型，目前支持 "rag"
        **kwargs: 数据源的配置参数
    
    Returns:
        DataSource: 数据源实例
    
    Examples:
        >>> ds = create_datasource_factory("rag", collection_name="articles")
        >>> docs = await ds.search("Python编程")
    """
    if source_type == "rag":
        return RAGDataSource(**kwargs)
    
    raise ValueError(f"Unsupported source type: {source_type}")