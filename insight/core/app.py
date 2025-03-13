from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional, Dict, Any, List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

from dataVisualizerManager import  generate_sql, generate_chart_config, get_messages
from interfaces import DataSource
from test_data import (
    EXAMPLE_DATASOURCE,
    EXAMPLE_CHART_DATA,
    EXAMPLE_CHART_REQUEST,
    EXAMPLE_SQL_REQUEST
)

# API密钥配置
API_KEY = os.getenv("API_KEY")
security = HTTPBearer(auto_error=False)

async def verify_api_key(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    """验证API密钥"""    
    # 如果Header中没有api-key，则检查Authorization Bearer token
    if credentials and credentials.credentials == API_KEY:
        return credentials.credentials
    
    # 如果两种方式都没有提供有效的API密钥，则抛出异常
    raise HTTPException(
        status_code=401, 
        detail="无效的API密钥"
    )

class ProcessType(str, Enum):
    """处理类型枚举"""
    COMPLETE = "complete"  # 完成流程
    ADJUST = "adjust"     # 调整配置

class DataSourceModel(BaseModel):
    """数据源模型"""
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

class SQLRequest(BaseModel):
    """SQL请求模型"""
    session_id: str = Field(
        description="会话ID，用于追踪请求",
        example=EXAMPLE_SQL_REQUEST["session_id"]
    )

    user_input: str = Field(
        description="用户输入的查询需求",
        example=EXAMPLE_SQL_REQUEST["user_input"]
    )
    datasource: DataSourceModel = Field(
        description="数据源信息",
        example=EXAMPLE_SQL_REQUEST["datasource"]
    )

    class Config:
        json_schema_extra = {
            "example": EXAMPLE_SQL_REQUEST
        }

class ChartRequest(BaseModel):
    """图表请求模型"""
    session_id: str = Field(
        description="会话ID，用于追踪请求",
        example=EXAMPLE_CHART_REQUEST["session_id"]
    )

    user_input: str = Field(
        description="用户输入的可视化需求",
        example=EXAMPLE_CHART_REQUEST["user_input"]
    )
    data: List[Dict[str, Any]] = Field(
        description="用于生成图表的数据",
        example=EXAMPLE_CHART_DATA
    )

    class Config:
        json_schema_extra = {
            "example": EXAMPLE_CHART_REQUEST
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
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有头
)

@app.post("/generate/sql", 
    response_model=Dict[str, Any],
    summary="生成SQL查询",
    description="根据用户输入和数据源信息生成对应的SQL查询语句",
    responses={
        200: {
            "description": "成功生成SQL查询",
            "content": {
                "application/json": {
                    "example": {
                        "sql": {"query": "SELECT * FROM table"},
                        "session_id": "abc123"
                    }
                }
            }
        },
        401: {
            "description": "未授权访问"
        },
        500: {
            "description": "服务器内部错误"
        }
    }
)
async def generate_sql_query(
    request: SQLRequest, 
    token: str = Depends(verify_api_key)
):
    """
    生成SQL查询接口
    
    - **request**: SQL请求参数
    - 返回生成的SQL查询和会话ID
    """
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
    description="根据用户输入和数据生成对应的图表配置",
    responses={
        200: {
            "description": "成功生成图表配置",
            "content": {
                "application/json": {
                    "example": {
                        "chart_config": {"type": "bar"},
                        "session_id": "abc123"
                    }
                }
            }
        },
        401: {
            "description": "未授权访问"
        },
        500: {
            "description": "服务器内部错误"
        }
    }
)
async def generate_chart(
    request: ChartRequest, 
    token: str = Depends(verify_api_key)
):
    """
    生成图表配置接口
    
    - **request**: 图表请求参数
    - 返回生成的图表配置和会话ID
    """
    try:
        # 生成图表配置
        chart_config = generate_chart_config(
            data=request.data,
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
    description="获取指定会话ID的所有历史消息记录",
    responses={
        200: {
            "description": "成功获取会话消息",
            "content": {
                "application/json": {
                    "example": {
                        "sql_messages": [],
                        "chart_messages": []
                    }
                }
            }
        },
        401: {
            "description": "未授权访问"
        },
        500: {
            "description": "服务器内部错误"
        }
    }
)
async def get_session_messages(
    session_id: str, 
    token: str = Depends(verify_api_key)
):
    """
    获取会话消息接口
    
    - **session_id**: 会话ID
    - 返回SQL消息和图表消息列表
    """
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
