from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional, Dict, Any, List


from dataVisualizerManager import  generate_sql, generate_chart_config, get_messages
from interfaces import DataSource
from test_data import (
    EXAMPLE_DATASOURCE,
    EXAMPLE_CHART_DATA,
    EXAMPLE_REQUEST
)

# TODO，将测试数据放到另一个文件中， 然后通过import 引入，让这里的文件更加清晰， 分离职能

class ProcessType(str, Enum):
    COMPLETE = "complete"  # 完成流程
    ADJUST = "adjust"     # 调整配置

class DataSourceModel(BaseModel):
    name: str = Field(
        description="数据源名称",
        example=EXAMPLE_DATASOURCE["name"]
    )
    description: str = Field(
        description="数据源描述",
        example=EXAMPLE_DATASOURCE["description"]
    )
    schema: str = Field(
        description="数据表结构定义",
        example=EXAMPLE_DATASOURCE["schema"]
    )
    example_data: str = Field(
        description="示例数据，JSON格式的字符串",
        example=EXAMPLE_DATASOURCE["example_data"]
    )
    special_fields: str = Field(
        description="特殊字段说明",
        example=EXAMPLE_DATASOURCE["special_fields"]
    )

class QueryRequest(BaseModel):
    session_id: str = Field(
        description="会话ID，用于追踪请求",
        example=EXAMPLE_REQUEST["session_id"]
    )
    type: ProcessType = Field(
        description="处理类型：complete(完整流程) 或 adjust(调整配置)",
        example=EXAMPLE_REQUEST["type"]
    )
    user_input: str = Field(
        description="用户输入的查询或可视化需求",
        example=EXAMPLE_REQUEST["user_input"]
    )
    datasource: DataSourceModel
    data: Optional[List[Dict[str, Any]]] = Field(
        default=None,
        description="用于生成图表的数据",
        example=EXAMPLE_CHART_DATA
    )

    class Config:
        json_schema_extra = {
            "example": EXAMPLE_REQUEST
        }

app = FastAPI(
    title="Data Insight API",
    description="""
数据洞察API服务，提供SQL生成和图表配置生成功能。

主要功能：
- 生成SQL查询
- 生成图表配置
- 获取会话历史记录
    """,
    version="1.0.0"
)

@app.post("/generate/sql", 
    response_model=Dict[str, Any],
    summary="生成SQL查询",
    description="根据用户输入和数据源信息生成对应的SQL查询语句"
)
async def generate_sql_query(request: QueryRequest):
    try:
        # 创建数据源
        datasource = DataSource(
            name=request.datasource.name,
            description=request.datasource.description,
            schema=request.datasource.schema,
            example_data=request.datasource.example_data,
            special_fields=request.datasource.special_fields
        )

        # 生成SQL查询
        sql_result = generate_sql(
            query=request.user_input,
            datasource=datasource,
            session_id=request.session_id
        )

        return {
            "sql": sql_result,
            "session_id": request.session_id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/chart",
    response_model=Dict[str, Any],
    summary="生成图表配置",
    description="根据用户输入和数据生成对应的图表配置"
)
async def generate_chart(request: QueryRequest):
    try:
        # 生成图表配置
        chart_config = generate_chart_config(
            data=request.data if request.data else [],
            query=request.user_input,
            session_id=request.session_id
        )

        return {
            "chart_config": chart_config,
            "session_id": request.session_id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/messages/{session_id}",
    summary="获取会话消息",
    description="获取指定会话ID的所有历史消息记录"
)
async def get_session_messages(session_id: str):
    try:
        sql_messages, chart_messages = get_messages(session_id)
        return {
            "sql_messages": [msg.model_dump() for msg in sql_messages],
            "chart_messages": [msg.model_dump() for msg in chart_messages]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


