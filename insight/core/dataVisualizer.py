
# Core interfaces for SQL generation and chart configuration from natural language
from typing import Dict, List, Any, Optional
import uuid

from interfaces import DataSource

from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from langchain_core.messages import (
    HumanMessage,
    SystemMessage,
    AIMessage,
    BaseMessage,
)


from dotenv import load_dotenv

load_dotenv()


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
        self.sql_messages: List[BaseMessage] = [SystemMessage(content=self.sql_system_message)]
        self.chart_messages: List[BaseMessage] = [SystemMessage(content=self.chart_system_message)]
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
        return "\n".join(history)

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
                query: str = Field(description="The SQL query to execute")
                explanation: str = Field(description="Explanation of what the SQL query does")

            # 2. Construct the prompt template with chat history
            chat_history = self._get_chat_history(self.sql_messages)
            template = """
            You are a SQL expert. Generate a SQL query based on the following information:
            
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
            model = ChatOpenAI(model=self.model_name, temperature=0)
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
            
            # 5. Update conversation history
            self.sql_messages.extend([
                HumanMessage(content=query),
                AIMessage(content=str(result))
            ])
            
            self.last_sql_query = result.query
            self.sql_query = result.query
            return {
                "query": result.query,
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
                multipleLines: Optional[bool] = Field(description="For line charts: whether comparing groups of data")
                measurementColumn: Optional[str] = Field(description="For line charts: key for quantitative y-axis column")
                lineCategories: Optional[List[str]] = Field(description="For line charts: categories for different lines")
                colors: Optional[Dict[str, str]] = Field(description="Mapping of data keys to color values")
                legend: bool = Field(description="Whether to show legend")
                explanation: str = Field(description="Explanation of the visualization")

            # 2. Construct the prompt template with chat history
            chat_history = self._get_chat_history(self.chart_messages)
            template = """
            You are a data visualization expert. Generate a chart configuration based on the following:
            
            Data Sample:
            {data}
            
            Previous conversation:
            {chat_history}
            
            User Query: {query}
            
            Generate an appropriate chart configuration to visualize this data.
            The configuration must include:
            - A description of what the chart shows
            - The main takeaway from the data
            - Appropriate chart type (bar, line, area, or pie)
            - Clear title
            - X and Y axis keys
            - Legend configuration
            
            For colors:
            - If the user specifies any colors in their query (e.g. "make it blue", "use yellow"), you MUST include those colors in the colors configuration
            - Colors should be specified as CSS color values (hex, rgb, or color names)
            - The colors configuration should map data keys to their corresponding colors
            - Example: if query mentions "yellow bars", set colors: {{"value": "yellow"}}
            
            Pay special attention to color requirements in the query and ensure they are reflected in the colors configuration.
            """

            prompt = ChatPromptTemplate.from_messages([
                ("system", template),
                ("human", "{input}")
            ])

            # 3. Set up the LLM with structured output
            model = ChatOpenAI(model=self.model_name, temperature=0)
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

