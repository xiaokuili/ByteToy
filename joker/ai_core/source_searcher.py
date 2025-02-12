from typing import Protocol, List, Dict, Any
from dataclasses import dataclass
import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions

@dataclass
class Document:
    """文档数据结构"""
    content: str
    metadata: Dict[str, Any]
    id: str 

class DataSource(Protocol):
    """数据源接口"""
    async def search(self, query: str) -> List[Document]: ...
    async def get_by_id(self, doc_id: str) -> Document: ...
    async def add(self, documents: List[Document]): ...

class RAGDataSource:
    """RAG实现的数据源"""
    def __init__(self, collection_name: str, similarity_threshold: float = 0.5):
        self.collection_name = collection_name
        # 初始化 ChromaDB 客户端
        self.client = chromadb.PersistentClient(path="chromadb")
        
        
        # 使用 SentenceTransformer 嵌入模型
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="BAAI/bge-small-en-v1.5"
        )
        
        # 获取或创建集合
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            embedding_function=self.embedding_function
        )

        self.similarity_threshold = similarity_threshold

    async def add(self, documents: List[Document]):
        """添加文档"""
        # 准备添加的文档数据
        contents = [doc.content for doc in documents]
        metadatas = [doc.metadata for doc in documents]
        ids = [doc.id for doc in documents]
        
        # 添加文档到集合
        self.collection.add(
            documents=contents,
            metadatas=metadatas,
            ids=ids
        )

    async def search(self, query: str) -> List[Document]:
        # 执行相似度搜索
        results = self.collection.query(
            query_texts=[query],
            n_results=5
        )
        
        documents = []
        for i in range(len(results['ids'][0])):
            # ChromaDB 返回的是距离，需要转换为相似度
            distance = results['distances'][0][i]
            similarity = 1 - (distance / 2)  # 转换为相似度分数 (0-1)
            
            # 只返回相似度高于阈值的文档
            if similarity >= self.similarity_threshold:
                doc = Document(
                    content=results['documents'][0][i],
                    metadata=results['metadatas'][0][i],
                    id=results['ids'][0][i]
                )
                documents.append(doc)
        
                
        return documents
    
    async def get_by_id(self, doc_id: str) -> Document:
        # 通过ID获取文档
        result = self.collection.get(
            ids=[doc_id]
        )
        
        if result and result['documents']:
            return Document(
                content=result['documents'][0],
                metadata=result['metadatas'][0],
                id=doc_id
            )
        return Document(content="", metadata={}, id=doc_id)

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