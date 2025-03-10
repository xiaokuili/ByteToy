
# Core interfaces for SQL generation and chart configuration from natural language
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass
from enum import Enum
import uuid
import re
import json

from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from langchain_core.messages import (
    HumanMessage,
    SystemMessage,
    AIMessage,
    BaseMessage,
    FunctionMessage
)
from langchain_core.prompts import PromptTemplate


from dotenv import load_dotenv

load_dotenv()


@dataclass
class DataSource:
    """Data source information needed for SQL generation and chart configuration."""
    name: str
    description: str
    schema: Dict[str, Any]  # Table schema information
    example_data: List[Dict[str, Any]]  # Sample data for context
    special_fields: Optional[Dict[str, Any]] = None  # Any special fields or constraints


# 定义一下 图表配置
@dataclass
class ChartConfig:
    """Chart configuration for data visualization."""
    chart_type: str  # 图表类型，如 'bar', 'line', 'pie', 'scatter' 等
    title: str  # 图表标题
    x_axis: Optional[str] = None  # X轴字段
    y_axis: Optional[Union[str, List[str]]] = None  # Y轴字段，可以是单个字段或多个字段列表
    color_by: Optional[str] = None  # 用于颜色分组的字段
    aggregation: Optional[str] = None  # 聚合方法，如 'sum', 'avg', 'count' 等
    filters: Optional[Dict[str, Any]] = None  # 数据过滤条件
    sort_by: Optional[Dict[str, str]] = None  # 排序设置，字段名到排序方向的映射
    limit: Optional[int] = None  # 数据限制数量
    additional_settings: Optional[Dict[str, Any]] = None  # 其他图表特定设置


class DataVisualizer:
    """
    Class for generating SQL queries and chart configurations from natural language.
    Handles both SQL generation and visualization configuration based on user queries.
    """
    
    def __init__(self, model_name: str = "gpt-4", session_id: Optional[str] = None):
        """
        Initialize the NLP data visualizer.
        
        Args:
            model_name: The name of the language model to use
            session_id: Unique identifier for this session
        """
        self.model_name = model_name
        self.session_id = session_id or str(uuid.uuid4())
        self.sql_system_message = """You are a SQL (postgres) and data visualization expert. 
        Your job is to help the user write a SQL query to retrieve the data they need."""
        self.chart_system_message = """You are a data visualization expert. 
        Your job is to generate chart configurations that best visualize the data and answer the user's query."""
        self.sql_messages: List[BaseMessage] = []
        self.chart_messages: List[BaseMessage] = []
        self.last_sql_query: Optional[str] = None
        self.last_chart_config: Optional[Dict[str, Any]] = None
        
    def generate_sql(
        self,
        query: str,
        datasource: DataSource,
        messages: Optional[List[BaseMessage]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate SQL based on natural language query, datasource information and conversation history.
        
        Args:
            query: Natural language query requesting data
            datasource: Information about the data source
            messages: Conversation history for context (if None, uses stored sql_messages)
            **kwargs: Additional parameters
            
        Returns:
            Dict[str, Any]: Dictionary containing the generated SQL query and updated messages
        """
        try:
            # Use provided messages or initialize a new conversation
            if messages is not None:
                all_messages = messages.copy()
            elif self.sql_messages:
                all_messages = self.sql_messages.copy()
            else:
                # First time initialization with system message
                system_message_content = f"""{self.sql_system_message}

Table Schema:
{datasource.schema}

Example Data Format:
{datasource.example_data}

Fields:
{datasource.special_fields}

Query Guidelines:
- Only retrieval (SELECT) queries are allowed
- For string fields, use case-insensitive search with: LOWER(column) ILIKE LOWER('%term%')
- For comma-separated list columns, trim whitespace before grouping
- When querying specific records, include both identifier and value columns

Data Formatting:
- Numeric values in billions use decimal format (10.0 = $10B)
- Rates/percentages stored as decimals (0.1 = 10%)
- Time-based analysis should group by year

Visualization Requirements:
- Every query must return data suitable for charts (minimum 2 columns)
- Single column requests should include count/frequency
- Rate queries should return decimal values
- Include appropriate grouping columns for visualization context
"""
                all_messages = [SystemMessage(content=system_message_content)]
            
            # Add the current user query if it's not already the last message
            if not all_messages or not isinstance(all_messages[-1], HumanMessage) or all_messages[-1].content != query:
                all_messages.append(HumanMessage(content=query))
            
            # Define output parser
            class SQLQueryOutput(BaseModel):
                query: str = Field(description="The SQL query to execute")
            
            # Create the output parser
            parser = PydanticOutputParser(pydantic_object=SQLQueryOutput)
            
            # Create prompt template
            prompt = ChatPromptTemplate.from_messages(all_messages)
            
            # Create LLM
            llm = ChatOpenAI(model=self.model_name, temperature=0)
            
            # Create and execute chain
            chain = prompt | llm
            response = chain.invoke({})
            
            # Try to parse the response
            try:
                # First try to extract structured output
                content = response.content if hasattr(response, 'content') else str(response)
                
                # Try to extract SQL between SQL code blocks
                sql_match = re.search(r'```sql\s*(.*?)\s*```', content, re.DOTALL)
                if sql_match:
                    sql_query = sql_match.group(1).strip()
                else:
                    # Try to parse as JSON
                    try:
                        json_data = json.loads(content)
                        if isinstance(json_data, dict) and 'query' in json_data:
                            sql_query = json_data['query']
                        else:
                            raise ValueError("JSON does not contain 'query' field")
                    except json.JSONDecodeError:
                        # If not JSON, try to extract query field from content
                        query_match = re.search(r'"query"\s*:\s*"(.*?)"', content, re.DOTALL)
                        if query_match:
                            sql_query = query_match.group(1).strip()
                        else:
                            # If all else fails, use the whole content as the query
                            sql_query = content.strip()
            except Exception as parsing_error:
                raise Exception(f"Could not parse SQL query from response: {content}")
            
            # Create a function message with the generated SQL
            function_message = FunctionMessage(
                name="generate_sql",
                content=sql_query
            )
            
            # Add the function message to the conversation history
            final_messages = all_messages + [function_message]
            
            # Update instance state
            self.sql_messages = final_messages
            self.last_sql_query = sql_query
            
            return {
                "query": sql_query
            }
        except Exception as e:
            raise Exception(f"Failed to generate query: {str(e)}")
    def generate_chart_config(
        self,
        data: List[Dict[str, Any]],
        query: str,
        messages: Optional[List[BaseMessage]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate chart configuration based on data, natural language query and conversation history.
        
        Args:
            data: The dataset to visualize
            query: Natural language query requesting visualization
            messages: Conversation history for context (if None, uses stored chart_messages)
            **kwargs: Additional parameters
            
        Returns:
            Dict[str, Any]: Chart configuration compatible with visualization libraries
        """
        data = data[:5]
        try:
            # Use provided messages or initialize a new conversation
            class ChartConfigOutput(BaseModel):
                chart_type: str = Field(description="The type of chart to use (bar, line, pie, scatter, etc.)")
                title: str = Field(description="The title of the chart")
                x_axis: str = Field(description="The field to use for the x-axis")
                y_axis: Union[str, List[str]] = Field(description="The field(s) to use for the y-axis")
                color_by: Optional[str] = Field(None, description="The field to use for color grouping")
                aggregation: Optional[str] = Field(None, description="The aggregation method to use (sum, avg, count, etc.)")
                additional_settings: Optional[Dict[str, Any]] = Field(None, description="Additional chart settings")
            
            # Set up a parser
            parser = PydanticOutputParser(pydantic_object=ChartConfigOutput)
            
            if messages is not None:
                all_messages = messages.copy()
            elif self.chart_messages:
                all_messages = self.chart_messages.copy()
            else:
                # First time initialization with system message
                system_message_content = f"""{self.chart_system_message}

Data Visualization Guidelines:
- Choose the most appropriate chart type for the data and query
- Ensure the chart title clearly describes what is being shown
- Select appropriate axes based on data types (categorical vs numerical)
- Use color grouping only when it adds meaningful information
- Apply aggregations when dealing with large datasets

IMPORTANT: Your response must be a valid JSON object with the chart configuration.
{parser.get_format_instructions()}"""
                all_messages = [SystemMessage(content=system_message_content)]
            
            # Add the current user query with data if it's not already the last message
            user_content = f"""Generate a visualization for this query: {query}

Data (sample of {len(data)} records):
{data[:5] if len(data) > 5 else data}

Total records: {len(data)}"""

            if not all_messages or not isinstance(all_messages[-1], HumanMessage) or all_messages[-1].content != user_content:
                all_messages.append(HumanMessage(content=user_content))
                
            # Create prompt template
            prompt = ChatPromptTemplate.from_messages(all_messages)
            
            # Create LLM
            llm = ChatOpenAI(model=self.model_name, temperature=0)
            
            # Create chain
            chain = prompt | llm | parser
            
            # Execute chain
            try:
                result = chain.invoke({})
                chart_config = ChartConfig(
                    chart_type=result.chart_type,
                    title=result.title,
                    x_axis=result.x_axis,
                    y_axis=result.y_axis,
                    color_by=result.color_by,
                    aggregation=result.aggregation,
                    additional_settings=result.additional_settings or {"legend": True}
                )
            except Exception as parsing_error:
                # Handle parsing errors by extracting config from the raw response
                raw_response = llm.invoke(prompt.format_messages({}))
                content = raw_response.content if hasattr(raw_response, 'content') else str(raw_response)
                
                # Try to extract JSON from the response
               
                json_match = re.search(r'```json\s*(.*?)\s*```', content, re.DOTALL)
                if json_match:
                    config_dict = json.loads(json_match.group(1).strip())
                    chart_config = ChartConfig(
                        chart_type=config_dict.get("chart_type", "bar"),
                        title=config_dict.get("title", "Chart"),
                        x_axis=config_dict.get("x_axis", ""),
                        y_axis=config_dict.get("y_axis", ""),
                        color_by=config_dict.get("color_by"),
                        aggregation=config_dict.get("aggregation"),
                        additional_settings=config_dict.get("additional_settings", {"legend": True})
                    )
                else:
                    raise Exception(f"Could not parse chart configuration from response: {content}")
            
            # Create an assistant message with the generated chart config
            assistant_message = AIMessage(
                content=str(chart_config)
            )
            
            # Add the assistant message to the conversation history
            final_messages = all_messages + [assistant_message]
            
            # Update instance state
            self.chart_messages = final_messages
            self.last_chart_config = chart_config
            
            return {
                "config": chart_config
            }
        except Exception as e:
            raise Exception(f"Failed to generate chart configuration: {str(e)}")

    def get_messages(self):
        return self.sql_messages, self.chart_messages
