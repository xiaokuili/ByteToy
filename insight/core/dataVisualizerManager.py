from typing import Dict, Any, Optional, List, Tuple
from langchain_core.messages import BaseMessage
from dataVisualizer import DataVisualizer, DataSource


class DataVisualizerManager:
    """
    Manager class for DataVisualizer instances.
    Maintains a registry of visualizers by session ID.
    """
    
    def __init__(self):
        """Initialize the manager with an empty registry."""
        self.visualizers: Dict[str, DataVisualizer] = {}
    
    def get_visualizer(self, session_id: Optional[str] = None) -> DataVisualizer:
        """
        Get an existing visualizer by ID or create a new one.
        
        Args:
            session_id: Optional ID for the visualizer session
            
        Returns:
            DataVisualizer: The requested or newly created visualizer
        """
        if session_id and session_id in self.visualizers:
            return self.visualizers[session_id]
        
        # Create new visualizer with provided ID or auto-generated ID
        visualizer = DataVisualizer(session_id=session_id)
        self.visualizers[visualizer.session_id] = visualizer
        return visualizer
    
    def remove_visualizer(self, session_id: str) -> bool:
        """
        Remove a visualizer from the registry.
        
        Args:
            session_id: ID of the visualizer to remove
            
        Returns:
            bool: True if removed, False if not found
        """
        if session_id in self.visualizers:
            del self.visualizers[session_id]
            return True
        return False
    
    def generate_sql(
        self,
        query: str,
        datasource: DataSource,
        session_id: Optional[str] = None,
        messages: Optional[List[BaseMessage]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate SQL using a specific visualizer instance.
        
        Args:
            query: Natural language query requesting data
            datasource: Information about the data source
            session_id: Optional ID for the visualizer session
            messages: Optional conversation history for context
            **kwargs: Additional parameters
            
        Returns:
            Dict[str, Any]: Dictionary containing the generated SQL query and updated messages
        """
        visualizer = self.get_visualizer(session_id)
        return visualizer.generate_sql(query, datasource, messages, **kwargs)
    
    def generate_chart_config(
        self,
        data: List[Dict[str, Any]],
        query: str,
        session_id: Optional[str] = None,
        messages: Optional[List[BaseMessage]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate chart configuration using a specific visualizer instance.
        
        Args:
            data: The dataset to visualize
            query: Natural language query requesting visualization
            session_id: Optional ID for the visualizer session
            messages: Optional conversation history for context
            **kwargs: Additional parameters
            
        Returns:
            Dict[str, Any]: Chart configuration compatible with visualization libraries
        """
        visualizer = self.get_visualizer(session_id)
        return visualizer.generate_chart_config(data, query, messages, **kwargs)

    def get_messages(self, session_id: str) -> Tuple[List[BaseMessage], List[BaseMessage]]:
        """
        Get the SQL and chart messages for a specific session.
        
        Args:
            session_id: ID of the visualizer session
            
        Returns:
            Tuple[List[BaseMessage], List[BaseMessage]]: SQL and chart messages
        """
        visualizer = self.get_visualizer(session_id)
        return visualizer.get_messages()
    

# Global manager instance for convenience
visualizer_manager = DataVisualizerManager()


def generate_sql(
    query: str,
    datasource: DataSource,
    session_id: Optional[str] = None,
    messages: Optional[List[BaseMessage]] = None,
    **kwargs
) -> Dict[str, Any]:
    """
    Generate SQL based on natural language query, datasource information and conversation history.
    
    Args:
        query: Natural language query requesting data
        datasource: Information about the data source
        session_id: Optional ID for the visualizer session
        messages: Optional conversation history for context
        **kwargs: Additional parameters
        
    Returns:
        Dict[str, Any]: Dictionary containing the generated SQL query and updated messages
    """
    return visualizer_manager.generate_sql(query, datasource, session_id, messages, **kwargs)


def generate_chart_config(
    data: List[Dict[str, Any]],
    query: str,
    session_id: Optional[str] = None,
    messages: Optional[List[BaseMessage]] = None,
    **kwargs
) -> Dict[str, Any]:
    """
    Generate chart configuration based on data, natural language query and conversation history.
    
    Args:
        data: The dataset to visualize
        query: Natural language query requesting visualization
        session_id: Optional ID for the visualizer session
        messages: Optional conversation history for context
        **kwargs: Additional parameters
        
    Returns:
        Dict[str, Any]: Chart configuration compatible with visualization libraries
    """
    return visualizer_manager.generate_chart_config(data, query, session_id, messages, **kwargs)


def get_messages(session_id: str) -> Tuple[List[BaseMessage], List[BaseMessage]]:
    """
    Get the SQL and chart messages for a specific session.
    """
    return visualizer_manager.get_messages(session_id)


if __name__ == "__main__":
    # 测试
    
    datasource = DataSource(
        name="products",
        description="存储电商平台商品信息的数据表",
        schema="""
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)""",
        example_data="""[
    {
        "id": 1,
        "name": "超值商品套装",
        "price": 500.00,
        "stock": 100,
        "category": "服装",
        "description": "这是一个高性价比的商品套装"
    },
    {
        "id": 2,
        "name": "限量特惠商品",
        "price": 299.99,
        "stock": 50,
        "category": "电子产品",
        "description": "限时特惠，数量有限"
    }
]""",
        special_fields="""name: 商品名称
price: 商品价格
stock: 库存数量
category: 商品类别
description: 商品描述"""
    )
    session_id = "test"
  
    print(generate_sql(
        query="商品价格最高的商品", 
        datasource=datasource,
        session_id=session_id,
        messages=[]
    ))
    print(get_messages(session_id))
    # data = [
    #     {
    #         "name": f"商品{i}",
    #         "price": 100 + i * 10,
    #         "stock": 50 + i * 5,
    #         "category": ["电子产品", "服装", "家居", "食品", "玩具"][i % 5],
    #         "description": f"商品{i}描述"
    #     } for i in range(1, 101)
    # ]

    # print(generate_chart_config(data, "商品价格最高的商品", datasource))