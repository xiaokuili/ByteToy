# Core interfaces for SQL generation and chart configuration from natural language
from typing import Dict, List, Any, Optional
import uuid
import os 

from interfaces import DataSource

from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
from langchain_deepseek import ChatDeepSeek
from pydantic import BaseModel, Field
from langchain_core.messages import (
    HumanMessage,
    SystemMessage,
    AIMessage,
    BaseMessage,
)


from dotenv import load_dotenv

load_dotenv()


def filter_messages_by_window(messages: List[BaseMessage], window_size: int = 5) -> List[BaseMessage]:
    """
    Filter messages using a sliding window to keep the conversation context manageable.
    
    Args:
        messages: List of conversation messages
        window_size: Size of the sliding window (number of message pairs to keep)
        
    Returns:
        List[BaseMessage]: Filtered list of messages within the window
    """
    if not messages:
        return []
        
    # If messages are less than window size, return all
    if len(messages) <= window_size * 2:
        return messages
        
    # Keep the first system message if it exists
    filtered = []
    if isinstance(messages[0], SystemMessage):
        filtered.append(messages[0])
        messages = messages[1:]
        
    # Get the last N pairs of messages (human + AI)
    message_pairs = list(zip(messages[::2], messages[1::2]))
    recent_pairs = message_pairs[-window_size:]
    
    # Flatten the pairs back into a single list
    filtered.extend([msg for pair in recent_pairs for msg in pair])
    
    return filtered


class DataVisualizer:
    # TODO：应该添加顶嘴功能，作为一个边界控制， 如果超出边界，应该返回而不是报错
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
        self.model_name = os.getenv("BASE_MODEL_NAME")
        self.session_id = session_id or str(uuid.uuid4())
        self.intent_system_message = """你是一个意图识别专家，你的任务是, 基于用户多轮对话， 判度用户当前输入是否需要重新生成sql
                                        1. 如果用户输入与修改SQL无关，之和图表配置有关，返回no 
                                        2. 如果用户输入涉及数据重新获取，返回yes
                                        3. 请注意联系多轮对话上下文， 不要孤立的看待当前输入

                                        示例1:
                                        历史对话:
                                        Human: 查询销售数据
                                        Assistant: 已生成查询销售数据的SQL
                                        Human: 把图表改成柱状图
                                        判断: no (因为只是修改图表类型，不需要重新查询数据)

                                        示例2:
                                        历史对话:
                                        Human: 查询去年的销售数据
                                        Assistant: 已生成去年销售数据的SQL
                                        Human: 我想看今年的数据
                                        判断: yes (因为需要查询新的时间范围的数据)

                                        示例3:
                                        历史对话:
                                        Human: 分析产品A的销售情况
                                        判断: yes (需要获取数据)
                                        """
        self.schema_system_message = """你是一个数据库模式分析专家，你的任务是:
                                    1. 基于用户的多轮对话历史和当前输入，生成创建表的SQL语句
                                    2. 返回的SQL语句需要符合PostgreSQL的语法， 并且只能够创建表
                                    3. 返回的SQL语句需要包含表的名称， 字段名称， 字段类型， 字段约束等
                                    4. 为了方便，通过create table if not exists 来创建表
                                    5. 请你一点定要按照规定的格式返回
                                   """
                                    
                            
        self.sql_system_message = """你是一个PostgreSQL专家，你的任务是:
                                    1. 基于用户的多轮对话历史和当前输入，生成合适的SQL查询语句
                                    """
        self.chart_system_message = """你是一个数据可视化专家，你的任务是:
                                    1. 基于用户的多轮对话历史和当前输入，生成合适的图表配置
                                    2. 我会提供历史用户输入和历史图表配置，请你更加聪明的结合上下文进行处理
                                    3. 颜色必须使用hsl()格式返回
                                    4. 针对不同类型的图表，颜色配置方式不同:
                                    
                                       A. 对于 bar, line, area, scatter, radar, composed 等图表:
                                          - 必须按照数据系列(yKeys)来配置颜色
                                          - 即使只有一个数据系列，也应使用yKey作为colors的键
                                          - 不要使用xKey中的值(如分类名称)作为colors的键
                                       
                                       B. 只有radialBar和pie类型图表:
                                          - 按照数据类别(xKey的值)配置颜色
                                    
                                    图表配置必须包含：图表类型、标题、描述、主要发现、x轴和y轴的键名、颜色设置、是否显示图例等。

                                    数据系列颜色配置示例(用于bar, line, area等):
                                    const barChartConfig = {{
                                        description: "This bar chart shows monthly sales by product category.",
                                        takeaway: "Electronics has the highest monthly sales among all categories.",
                                        type: "bar",
                                        title: "Monthly Sales by Category",
                                        xKey: "category",
                                        yKeys: ["sales", "profit"],
                                        colors: {{
                                            "sales": "hsl(240, 70%, 50%)",    // 蓝色
                                            "profit": "hsl(120, 70%, 50%)"    // 绿色
                                        }},
                                        legend: true
                                    }};
                                    
                                    // 即使只有一个数据系列，也使用yKey作为colors的键
                                    const singleSeriesBarConfig = {{
                                        description: "This bar chart shows monthly sales by category.",
                                        takeaway: "Electronics has the highest monthly sales.",
                                        type: "bar",
                                        title: "Monthly Sales by Category",
                                        xKey: "category",
                                        yKeys: ["sales"],
                                        colors: {{
                                            "sales": "hsl(240, 70%, 50%)"    // 蓝色
                                        }},
                                        legend: true
                                    }};
                                    
                                    类别颜色配置示例(仅用于pie和radialBar):
                                    const pieChartConfig = {{
                                        description: "This pie chart shows the distribution of different categories.",
                                        takeaway: "The pie chart highlights the proportions of each category.",
                                        type: "pie",
                                        title: "Distribution of Categories",
                                        xKey: "category",
                                        yKeys: ["value"],
                                        colors: {{ 
                                            "Apple": "hsl(0, 70%, 50%)",      // 红色
                                            "Orange": "hsl(30, 70%, 50%)"     // 橙色
                                        }}, 
                                        legend: true
                                    }};
                                    """
     
        self.intent_messages: List[BaseMessage] = []
        self.sql_messages: List[BaseMessage] = []
        self.chart_messages: List[BaseMessage] = []
        self.schema_messages: List[BaseMessage] = []

        self.last_sql_query: Optional[str] = None
        self.last_chart_config: Optional[Dict[str, Any]] = None
        self.sql_query = ""

    def _get_chat_history(self, messages: List[BaseMessage]) -> str:
        """将消息历史记录转换为字符串格式"""
        history = []
        for msg in messages[1:]:  # Skip the system message
            if isinstance(msg, HumanMessage):
                history.append(f"Human: {msg.content}")
            elif isinstance(msg, AIMessage):
                history.append(f"Assistant: {msg.content}")

                
        filtered_history = filter_messages_by_window(history)
        return "\n".join(filtered_history)


    def generate_intent(self, query: str) -> str:
        """
        生成意图
        
        Args:
            query: 用户输入的自然语言查询
            
        Returns:
            str: 意图判断结果 ('yes' 或 'no')
        """
        if not self.intent_messages:
            return "yes"
        try:
            # 1. Define output schema using Pydantic
            class IntentOutput(BaseModel):
                intent: str = Field(description="意图判断结果，yes表示需要重新生成SQL，no表示不需要")
                explanation: str = Field(description="意图判断的解释说明")

            # 2. Construct the prompt template with chat history
            chat_history = self._get_chat_history(self.intent_messages)
            template = self.intent_system_message + """
            
            Previous conversation:
            {chat_history}
            
            User Query: {query}
            
            判断是否需要重新生成SQL查询。
            """

            prompt = ChatPromptTemplate.from_messages([
                ("system", template),
                ("human", "{input}")
            ])

            # 3. Set up the LLM with structured output
            model = ChatDeepSeek(model=self.model_name, api_base=os.getenv("DEEPSEEK_BASE_URL"), temperature=0)
            chain = prompt | model.with_structured_output(IntentOutput)

            # 4. Execute the chain
            result = chain.invoke({
                "chat_history": chat_history,
                "query": query,
                "input": query
            })

            self.intent_messages.extend([
                HumanMessage(content=query),
                AIMessage(content=str(result))
            ])
            return result.intent

        except Exception as e:
            raise Exception(f"Failed to generate intent: {str(e)}")

    def generate_create_table_sql(
        self,
        query: str,
        datasource: DataSource,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate schema based on natural language query and datasource information.
        
        Args:
            query: Natural language query requesting data
            datasource: Information about the data source
            **kwargs: Additional parameters
            
        Returns:
            Dict[str, Any]: Dictionary containing the identified schema information
        """
        try:
            # 1. Define output schema using Pydantic
            class SchemaOutput(BaseModel):
                sql: str = Field(description="The SQL to create the table")

            # 2. Construct the prompt template with chat history
            chat_history = self._get_chat_history(self.schema_messages)
            template = self.schema_system_message + """
            
            Example Data:
            {example_data}
            
            Special Fields:
            {special_fields}
            
            Previous conversation:
            {chat_history}
            
          
            
            """

            prompt = ChatPromptTemplate.from_messages([
                ("system", template),
                ("human", "{input}")
            ])

            # 3. Set up the LLM with structured output
            model = ChatDeepSeek(model=self.model_name, api_base=os.getenv("DEEPSEEK_BASE_URL"), temperature=0)
            chain = prompt | model.with_structured_output(SchemaOutput)

            # 4. Execute the chain
            result = chain.invoke({
                "example_data": datasource.example_data,
                "special_fields": datasource.special_fields,
                "chat_history": chat_history,
                "input": query
            })

            # 5. Update conversation history
            self.schema_messages.extend([
                HumanMessage(content=query),
                AIMessage(content=str(result))
            ])
            print(result)
            return {
                "create_table_sql": result.sql,
            }

        except Exception as e:
            raise Exception(f"Failed to generate schema: {str(e)}")

    def generate_sql(
        self,
        query: str,
        datasource: DataSource,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate SQL based on natural language query and datasource information.
        
        Args:
            query: Natural language query requesting data
            datasource: Information about the data source
            **kwargs: Additional parameters
            
        Returns:
            Dict[str, Any]: Dictionary containing the generated SQL query
        """
        try:
            # 1. Define output schema using Pydantic
            class SQLQueryOutput(BaseModel):
                sql: str = Field(description="The SQL query to execute, 也可能是历史sql")
                explanation: str = Field(description="Explanation of what the SQL query does，如果是历史sql，也进行解释")

            # 2. Construct the prompt template with chat history
            chat_history = self._get_chat_history(self.sql_messages)
            template = self.sql_system_message + """
            
            Table Schema:
            {schema}
            
            Example Data:
            {example_data}
            
            Special Fields:
            {special_fields}
            
            Previous conversation:
            {chat_history}
            
            User Query: {query}
            
            Generate a SQL query to answer this question.
            """

            prompt = ChatPromptTemplate.from_messages([
                ("system", template),
                ("human", "{input}")
            ])

            # 3. Set up the LLM with structured output
            model = ChatDeepSeek(model=self.model_name, api_base=os.getenv("DEEPSEEK_BASE_URL"), temperature=0)
            chain = prompt | model.with_structured_output(SQLQueryOutput)
            # 4. Execute the chain
            result = chain.invoke({
                "schema": datasource.schema,
                "example_data": datasource.example_data,
                "special_fields": datasource.special_fields,
                "chat_history": chat_history,
                "query": query,
                "input": query
            })
            

            self.intent_messages.extend([
                HumanMessage(content=query),
                AIMessage(content=str(result))
            ])
       
            
            self.last_sql_query = result.sql
            self.sql_query = result.sql

           
            return {
                "query": result.sql,
                "explanation": result.explanation
            }

        except Exception as e:
            raise Exception(f"Failed to generate query: {str(e)}")

    def generate_chart_config(
        self,
        data: List[Dict[str, Any]],
        query: str,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate chart configuration based on data, natural language query and conversation history.
        
        Args:
            data: The dataset to visualize
            query: Natural language query requesting visualization
            **kwargs: Additional parameters
            
        Returns:
            Dict[str, Any]: Dictionary containing the chart configuration
        """
        try:
            # 1. Define output schema using Pydantic
            class ChartConfigOutput(BaseModel):
                description: str = Field(description="Describe what the chart is showing")
                takeaway: str = Field(description="The main takeaway from the chart")
                type: str = Field(description="Type of chart (bar, line, area, pie)")
                title: str = Field(description="The title of the chart")
                xKey: str = Field(description="Key for x-axis or category")
                yKeys: List[str] = Field(description="Key(s) for y-axis values")
                multipleLines: Optional[bool] = Field(default=False, description="For line charts: whether comparing groups of data")
                measurementColumn: Optional[str] = Field(default=None, description="For line charts: key for quantitative y-axis column")
                lineCategories: Optional[List[str]] = Field(default=[], description="For line charts: categories for different lines")
                colors: Optional[Dict[str, str]] = Field(default={}, description="Mapping of data keys to color values")
                legend: bool = Field(description="Whether to show legend")
                explanation: str = Field(description="Explanation of the visualization")

            # 2. Construct the prompt template with chat history
            chat_history = self._get_chat_history(self.chart_messages)
            template = self.chart_system_message + """

            Data Sample:
            {data}
            
            Previous conversation:
            {chat_history}
            
            User Query: {query}
            
           
            """

            prompt = ChatPromptTemplate.from_messages([
                ("system", template),
                ("human", "{input}")
            ])

            # 3. Set up the LLM with structured output
            model = ChatDeepSeek(model=self.model_name, api_base=os.getenv("DEEPSEEK_BASE_URL"), temperature=0)
            chain = prompt | model.with_structured_output(ChartConfigOutput)

            # 4. Execute the chain
            result = chain.invoke({
                "data": str(data[:5]),
                "chat_history": chat_history,
                "query": query,
                "input": query
            })
            
            # 5. Update conversation history
            self.chart_messages.extend([
                HumanMessage(content=query),
                AIMessage(content=str(result))
            ])

        
            self.last_chart_config = result
            if result.colors is None:
                # Generate colors for each y-axis key
                result.colors = {}
                for i, key in enumerate(result.yKeys):
                    result.colors[key] = f"hsl(var(--chart-{i + 1}))"
          
            return {
                "config": {
                    "description": result.description,
                    "takeaway": result.takeaway,
                    "type": result.type,
                    "title": result.title,
                    "xKey": result.xKey,
                    "yKeys": result.yKeys,
                    "multipleLines": result.multipleLines,
                    "measurementColumn": result.measurementColumn,
                    "lineCategories": result.lineCategories,
                    "colors": result.colors,
                    "legend": result.legend,
                    "explanation": result.explanation
                }
            }

        except Exception as e:
            raise Exception(f"Failed to generate chart configuration: {str(e)}")

    def get_messages(self):
        return self.sql_messages, self.chart_messages

    def get_sql_query(self):
        return self.sql_query

