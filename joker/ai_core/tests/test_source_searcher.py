import pytest
from ..source_searcher import Document, RAGDataSource, create_datasource_factory
@pytest.mark.asyncio

async def test_rag_datasource():
    # Initialize RAG data source
    ds = RAGDataSource(collection_name="test_collection")
    
    # Test add and search functionality
    test_docs = [
        Document(content="Python是一门编程语言", metadata={"type": "language"}, id="1"),
        Document(content="JavaScript用于Web开发", metadata={"type": "language"}, id="2"),
        Document(content="Docker帮助容器化部署", metadata={"type": "tool"}, id="3")
    ]
    
    # Add documents
    await ds.add(test_docs)
    
    # Test search functionality
    results = await ds.search("编程语言")
    
    # Verify search results
    assert isinstance(results, list)
    assert len(results) > 0
    for doc in results:
        assert isinstance(doc, Document)
        assert isinstance(doc.content, str)
        assert isinstance(doc.metadata, dict)
    assert any("Python" in doc.content for doc in results)

    # Test get_by_id functionality 
    doc = await ds.get_by_id("1")
    
    # Verify get_by_id result
    assert isinstance(doc, Document)
    assert isinstance(doc.content, str)
    assert isinstance(doc.metadata, dict)

def test_create_datasource_factory():
    # Test creating RAG data source
    ds = create_datasource_factory("rag", collection_name="test_collection")
    assert isinstance(ds, RAGDataSource)
    
    # Test invalid source type
    with pytest.raises(ValueError):
        create_datasource_factory("invalid_type")
@pytest.mark.asyncio
async def test_rag_datasource_add_and_empty_search():
    # Initialize RAG data source
    ds = RAGDataSource(collection_name="empty_collection", similarity_threshold=0.9)
    
    # Add unrelated documents
    unrelated_docs = [
        Document(content="Completely unrelated content", metadata={"type": "other"}, id="1"),
    ]
    await ds.add(unrelated_docs)
    
    # Test search with no relevant matches
    results = await ds.search("量子物理理论")
    assert isinstance(results, list)
    assert len(results) == 0

@pytest.mark.asyncio
async def test_document_creation():
    # Test Document dataclass
    doc = Document(content="test content", metadata={"key": "value"}, id="1")
    assert doc.content == "test content"
    assert doc.metadata == {"key": "value"}
