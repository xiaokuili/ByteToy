from typing import Dict, Any, Optional, List, Tuple
from langchain_core.messages import BaseMessage

from dataVisualizer import DataVisualizer
from  interfaces import DataSource


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
        intent = visualizer.generate_intent(query)
        print("intent", intent)
        if intent == "yes":
            return visualizer.generate_sql(query, datasource, **kwargs)
        else:
            sql = visualizer.get_sql_query()
            print("sql", sql)
            return {
                "query": sql,
                "explanation": intent
            }
            
        
    def generate_chart_config(
        self,
        data: List[Dict[str, Any]],
        query: str,
        session_id: Optional[str] = None,
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
        return visualizer.generate_chart_config(data, query, **kwargs)

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
    
    def get_sql_query(self, session_id: str) -> str:
        """
        Get the SQL query for a specific session.
        """
        visualizer = self.get_visualizer(session_id)
        return visualizer.get_sql_query()
    

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
    return visualizer_manager.generate_sql(query, datasource, session_id, **kwargs)


def generate_chart_config(
    data: List[Dict[str, Any]],
    query: str,
    session_id: Optional[str] = None,
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
    return visualizer_manager.generate_chart_config(data, query, session_id, **kwargs)


def get_messages(session_id: str) -> Tuple[List[BaseMessage], List[BaseMessage]]:
    """
    Get the SQL and chart messages for a specific session.
    """
    return visualizer_manager.get_messages(session_id)


if __name__ == "__main__":
    # 测试
    # 创建测试数据源
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

    # 生成测试数据集
    data = [
        {
            "name": f"商品{i}",
            "price": 100 + i * 10,
            "stock": 50 + i * 5,
            "category": ["电子产品", "服装", "家居", "食品", "玩具"][i % 5],
            "description": f"商品{i}描述"
        } for i in range(1, 101)
    ]

    def print_section(title):
        print("\n" + "="*80)
        print(f"{title:^80}")
        print("="*80)

    def print_json(title, obj):
        import json
        print(f"\n{title}:")
        print("-" * 40)
        formatted = json.dumps(obj, indent=2, ensure_ascii=False)
        # 为每行添加缩进
        formatted = "\n".join(f"    {line}" for line in formatted.split("\n"))
        print(formatted)

    session_id = "test"

    # 测试1: SQL生成
    print_section("测试SQL查询生成")
    sql_result = generate_sql(
        query="查询每个类别中价格最高的商品", 
        datasource=datasource,
        session_id=session_id,
       
    )
    print_json("生成的SQL查询", sql_result)

    # 测试2: 基础图表生成
    print_section("测试基础图表生成")
    basic_config = generate_chart_config(
        data=data,
        query="展示各个类别的商品数量分布",
        session_id=session_id,
    )
    print_json("基础饼图配置", basic_config)

    # 测试3: 颜色定制
    print_section("测试图表颜色定制")
    color_tests = [
        ("使用蓝色主题展示各类别平均价格", "蓝色主题柱状图"),
        ("用红色和绿色展示不同类别的库存对比", "双色对比图"),
        ("使用渐变色展示商品价格趋势", "渐变色趋势图")
    ]
    
    for query, desc in color_tests:
        config = generate_chart_config(
            data=data,
            query=query,
            session_id=session_id,
        )
        print_json(desc, config)

    # 测试4: 图表类型切换
    print_section("测试图表类型切换")
    chart_types = [
        ("用折线图展示商品价格变化趋势", "折线图测试"),
        ("用柱状图展示各类别库存总量", "柱状图测试"),
        ("用面积图展示各类别价格分布", "面积图测试"),
        ("用饼图展示商品类别占比", "饼图测试")
    ]
    
    for query, desc in chart_types:
        config = generate_chart_config(
            data=data,
            query=query,
            session_id=session_id,
        )
        print_json(desc, config)

    # 测试5: 复杂可视化
    print_section("测试复杂可视化需求")
    complex_tests = [
        ("展示每个类别的平均价格和库存的关系，用气泡大小表示库存量", "多维度可视化"),
        ("比较不同类别商品的价格区间分布，用堆叠图表示", "堆叠分布图"),
        ("分析价格与库存的相关性，使用散点图展示", "相关性分析")
    ]
    
    for query, desc in complex_tests:
        config = generate_chart_config(
            data=data,
            query=query,
            session_id=session_id,
        )
        print_json(desc, config)

    # 测试6: 消息历史记录
    print_section("测试消息历史记录")
    final_sql_messages, final_chart_messages = get_messages(session_id)
    print("\nSQL消息历史:")
    print(f"- 总消息数: {len(final_sql_messages)}")
    print(f"- 系统消息数: {sum(1 for m in final_sql_messages if m.type == 'system')}")
    print(f"- 用户消息数: {sum(1 for m in final_sql_messages if m.type == 'human')}")
    print(f"- AI响应数: {sum(1 for m in final_sql_messages if m.type == 'ai')}")
    
    print("\n图表消息历史:")
    print(f"- 总消息数: {len(final_chart_messages)}")
    print(f"- 系统消息数: {sum(1 for m in final_chart_messages if m.type == 'system')}")
    print(f"- 用户消息数: {sum(1 for m in final_chart_messages if m.type == 'human')}")
    print(f"- AI响应数: {sum(1 for m in final_chart_messages if m.type == 'ai')}")
