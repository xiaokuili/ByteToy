
export const testTableData = {
    name: "products",
    description: "存储电商平台商品信息的数据表",
    schema: `
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,
    example_data: `[
    {
        "id": 1,
        "name": "超值商品套装",
        "price": ${(Math.random() * 1000).toFixed(2)},
        "stock": ${Math.floor(Math.random() * 1000)},
        "category": "服装",
        "description": "这是一个高性价比的商品套装"
    },
    {
        "id": 2,
        "name": "限量特惠商品",
        "price": ${(Math.random() * 1000).toFixed(2)},
        "stock": ${Math.floor(Math.random() * 1000)},
        "category": "电子产品",
        "description": "限时特惠，数量有限"
    }
]`,
    special_fields: `name: 商品名称
price: 商品价格
stock: 库存数量
category: 商品类别
description: 商品描述`
}