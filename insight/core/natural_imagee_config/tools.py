"""This module provides example tools for web scraping and search functionality.

It includes a basic Tavily search function (as an example)

These tools are intended as free examples to get started. For production use,
consider implementing more robust and specialized tools tailored to your needs.
"""

from typing import Any, Callable, List, Optional, cast, Dict, Any

from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import InjectedToolArg
from langchain_core.tools import tool
from typing_extensions import Annotated

from agent.configuration import Configuration


async def search(
    query: str, *, config: Annotated[RunnableConfig, InjectedToolArg]
) -> Optional[list[dict[str, Any]]]:
    """Search for general web results.

    This function performs a search using the Tavily search engine, which is designed
    to provide comprehensive, accurate, and trusted results. It's particularly useful
    for answering questions about current events.
    """
    configuration = Configuration.from_runnable_config(config)
    wrapped = TavilySearchResults(max_results=configuration.max_search_results)
    result = await wrapped.ainvoke({"query": query})
    return cast(list[dict[str, Any]], result)


TOOLS: List[Callable[..., Any]] = [search]


@tool
def get_data_tool(query: Annotated[str, "The data query to execute"]):
    """Tool to retrieve data based on a query. This is a placeholder that will be implemented later."""
    # This is a placeholder - replace with actual implementation
    print(f"Data retrieval requested with query: {query}")
    
    # Return sample data for now
    sample_data = {
        "columns": ["Date", "Sales", "Region"],
        "data": [
            ["2023-01-01", 1200, "North"],
            ["2023-01-01", 950, "South"],
            ["2023-01-02", 1300, "North"],
            ["2023-01-02", 1100, "South"],
            ["2023-01-03", 1400, "North"],
            ["2023-01-03", 1050, "South"]
        ]
    }
    
    return f"Retrieved data for query: {query}\nSample data: {sample_data}"


@tool
def analyze_data_tool(
    data: Annotated[Dict[str, Any], "The data to analyze"],
    analysis_type: Annotated[str, "Type of analysis to perform"]
):
    """Tool to analyze data. This is a placeholder that will be implemented later."""
    # This is a placeholder - replace with actual implementation
    print(f"Data analysis requested of type: {analysis_type}")
    print(f"Data to analyze: {data}")
    
    # Return sample analyzed data
    analyzed_result = {
        "analysis_type": analysis_type,
        "summary": {
            "total_sales": 7000,
            "by_region": {"North": 3900, "South": 3100},
            "trend": "increasing"
        }
    }
    
    return f"Analyzed data using {analysis_type}: {analyzed_result}"


@tool
def generate_chart_config_tool(
    data: Annotated[Dict[str, Any], "The data to visualize"],
    chart_type: Annotated[str, "Type of chart to generate"]
):
    """Tool to generate chart configuration. This is a placeholder that will be implemented later."""
    # This is a placeholder - replace with actual implementation
    print(f"Chart generation requested of type: {chart_type}")
    print(f"Data to visualize: {data}")
    
    # Create a sample chart configuration based on the requested chart type
    if chart_type.lower() == "bar":
        sample_config = {
            "type": "bar",
            "data": {
                "labels": ["North", "South"],
                "datasets": [{
                    "label": "Sales by Region",
                    "data": [3900, 3100],
                    "backgroundColor": ["rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)"],
                    "borderColor": ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
                    "borderWidth": 1
                }]
            },
            "options": {
                "responsive": True,
                "plugins": {
                    "title": {
                        "display": True,
                        "text": "Sales by Region"
                    }
                }
            }
        }
    elif chart_type.lower() == "line":
        sample_config = {
            "type": "line",
            "data": {
                "labels": ["2023-01-01", "2023-01-02", "2023-01-03"],
                "datasets": [
                    {
                        "label": "North",
                        "data": [1200, 1300, 1400],
                        "borderColor": "rgba(75, 192, 192, 1)",
                        "tension": 0.1
                    },
                    {
                        "label": "South",
                        "data": [950, 1100, 1050],
                        "borderColor": "rgba(153, 102, 255, 1)",
                        "tension": 0.1
                    }
                ]
            },
            "options": {
                "responsive": True,
                "plugins": {
                    "title": {
                        "display": True,
                        "text": "Sales Trend by Region"
                    }
                }
            }
        }
    elif chart_type.lower() == "pie":
        sample_config = {
            "type": "pie",
            "data": {
                "labels": ["North", "South"],
                "datasets": [{
                    "data": [3900, 3100],
                    "backgroundColor": ["rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)"],
                    "borderColor": ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
                    "borderWidth": 1
                }]
            },
            "options": {
                "responsive": True,
                "plugins": {
                    "title": {
                        "display": True,
                        "text": "Sales Distribution by Region"
                    }
                }
            }
        }
    else:
        # Default to a generic configuration
        sample_config = {
            "type": chart_type,
            "data": {"placeholder": "sample_data"},
            "options": {"responsive": True}
        }
    
    return sample_config