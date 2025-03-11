curl -X POST "http://localhost:8000/generate" \
-H "Content-Type: application/json" \
-d '{
  "session_id": "test-session-1",
  "type": "complete",
  "user_input": "展示各个类别的商品数量分布",
  "datasource": {
    "name": "products",
    "description": "存储电商平台商品信息的数据表",
    "schema": {
      "fields": [
        {"name": "id", "type": "SERIAL", "primary_key": true},
        {"name": "name", "type": "VARCHAR(200)", "nullable": false},
        {"name": "price", "type": "DECIMAL(10,2)", "nullable": false},
        {"name": "stock", "type": "INTEGER", "nullable": false},
        {"name": "category", "type": "VARCHAR(50)", "nullable": false}
      ]
    },
    "example_data": [
      {
        "id": 1,
        "name": "超值商品套装",
        "price": 500.00,
        "stock": 100,
        "category": "服装"
      },
      {
        "id": 2,
        "name": "限量特惠商品",
        "price": 299.99,
        "stock": 50,
        "category": "电子产品"
      }
    ],
    "special_fields": {
      "name": "商品名称",
      "price": "商品价格",
      "stock": "库存数量",
      "category": "商品类别"
    }
  },
  "data": [
    {
      "name": "商品1",
      "price": 100,
      "stock": 50,
      "category": "电子产品"
    },
    {
      "name": "商品2",
      "price": 200,
      "stock": 30,
      "category": "服装"
    }
  ]
}'


curl -X POST "http://localhost:8000/generate" \
-H "Content-Type: application/json" \
-d '{
  "session_id": "test-session-2",
  "type": "adjust",
  "user_input": "使用柱状图展示各类别的平均价格",
  "datasource": {
    "name": "products",
    "description": "存储电商平台商品信息的数据表",
    "schema": {
      "fields": [
        {"name": "id", "type": "SERIAL", "primary_key": true},
        {"name": "name", "type": "VARCHAR(200)", "nullable": false},
        {"name": "price", "type": "DECIMAL(10,2)", "nullable": false},
        {"name": "category", "type": "VARCHAR(50)", "nullable": false}
      ]
    },
    "example_data": [
      {
        "id": 1,
        "name": "商品A",
        "price": 100.00,
        "category": "电子产品"
      }
    ],
    "special_fields": {
      "price": "商品价格",
      "category": "商品类别"
    }
  },
  "data": [
    {
      "name": "商品1",
      "price": 100,
      "category": "电子产品"
    },
    {
      "name": "商品2",
      "price": 200,
      "category": "服装"
    }
  ]
}'

curl -X GET "http://localhost:8000/messages/test-session-1"