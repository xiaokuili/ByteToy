"""
测试数据和示例配置
"""

# 示例数据源配置
EXAMPLE_DATASOURCE = {
    "name": "products",
    "description": "存储电商平台商品信息的数据表",
    "schema": """CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)""",
    "example_data": """[
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
    "special_fields": """name: 商品名称
price: 商品价格
stock: 库存数量
category: 商品类别
description: 商品描述"""
}

# 示例图表数据
EXAMPLE_CHART_DATA = [
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
]

# SQL请求示例
EXAMPLE_SQL_REQUEST = {
    "session_id": "test-session-001", 
    "type": "complete",
    "user_input": "查询每个类别中价格最高的商品",
    "datasource": EXAMPLE_DATASOURCE
}

# 图表请求示例
EXAMPLE_CHART_REQUEST = {
    "session_id": "test-session-001",
    "type": "complete", 
    "user_input": "展示各个类别的商品数量分布",
    "data": EXAMPLE_CHART_DATA
}

# 完整的请求示例
EXAMPLE_REQUEST = {
    "session_id": "test-session-001",
    "type": "complete",
    "user_input": "查询每个类别中价格最高的商品",
    "datasource": EXAMPLE_DATASOURCE,
    "data": EXAMPLE_CHART_DATA
}

# 测试数据集
TEST_DATA = [
    {
        "id": i,
        "name": f"商品{i}",
        "price": 100 + i * 10,
        "stock": 50 + i * 5,
        "category": ["电子产品", "服装", "家居", "食品", "玩具"][i % 5],
        "description": f"商品{i}描述",
        "created_at": "2024-01-01T00:00:00"
    } for i in range(1, 101)
]

# 测试用例
TEST_CASES = {
    "sql_generation": [
        {
            "name": "类别最高价格查询",
            "input": "查询每个类别中价格最高的商品",
            "expected_fields": ["category", "name", "price"]
        },
        {
            "name": "库存统计查询",
            "input": "统计各个类别的总库存量",
            "expected_fields": ["category", "total_stock"]
        }
    ],
    "chart_generation": [
        {
            "name": "类别分布饼图",
            "input": "展示各个类别的商品数量分布",
            "expected_type": "pie"
        },
        {
            "name": "价格趋势图",
            "input": "展示不同类别的平均价格对比",
            "expected_type": "bar"
        }
    ]
}