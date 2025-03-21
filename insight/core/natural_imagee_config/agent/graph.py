import getpass
import os
from typing import Annotated, Dict, Any, List, Union

from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.tools import tool
from langchain_experimental.utilities import PythonREPL

from typing import Literal

from langchain_core.messages import BaseMessage, HumanMessage
from langchain_deepseek import ChatDeepSeek
from langgraph.prebuilt import create_react_agent
from langgraph.graph import MessagesState, END
from langgraph.types import Command

from langgraph.graph import StateGraph, START

from tools import get_data_tool, analyze_data_tool, generate_chart_config_tool
from dotenv import load_dotenv

load_dotenv()


def _set_if_undefined(var: str):
    if not os.environ.get(var):
        os.environ[var] = getpass.getpass(f"Please provide your {var}")


# Define custom ChartAgentState that extends MessagesState to include additional chart-specific state
class ChartAgentState(MessagesState):
    """State for chart generation agents that includes query, data, and config information"""
    query: str = ""
    dataset: Dict[str, Any] = {}
    chart_config: Dict[str, Any] = {}
    current_agent: str = ""  # Track the current active agent


_set_if_undefined("DEEPSEEK_API_KEY")
_set_if_undefined("DEEPSEEK_BASE_URL")
_set_if_undefined("BASE_MODEL_NAME")

MODEL_NAME = os.getenv("BASE_MODEL_NAME")
BASE_URL = os.getenv("DEEPSEEK_BASE_URL")


tavily_tool = TavilySearchResults(max_results=5)

# Warning: This executes code locally, which can be unsafe when not sandboxed
repl = PythonREPL()


@tool
def python_repl_tool(
    code: Annotated[str, "The python code to execute to generate your chart."],
):
    """Use this to execute python code. If you want to see the output of a value,
    you should print it out with `print(...)`. This is visible to the user."""
    try:
        result = repl.run(code)
    except BaseException as e:
        return f"Failed to execute. Error: {repr(e)}"
    result_str = f"Successfully executed:\n\`\`\`python\n{code}\n\`\`\`\nStdout: {result}"
    return (
        result_str + "\n\nIf you have completed all tasks, respond with FINAL ANSWER."
    )


def make_system_prompt(suffix: str) -> str:
    return (
        "You are a helpful AI assistant that helps create charts from natural language queries."
        " Use the provided tools to progress towards generating the requested chart."
        " Your goal is to understand the user's needs, get the right data, analyze it appropriately,"
        " and create a visualization that answers their question."
        f"\n{suffix}"
    )


llm = ChatDeepSeek(model=os.getenv("BASE_MODEL_NAME"), api_base=os.getenv("DEEPSEEK_BASE_URL"), temperature=0)


# Supervisor agent to coordinate the workflow
supervisor_agent = create_react_agent(
    llm,
    [],  # No specific tools for the supervisor
    prompt=make_system_prompt(
        "You are the supervisor agent that coordinates the chart creation process. "
        "Your job is to determine which specialized agent should handle the current step: "
        "1) Intention Recognizer: To understand what the user wants to visualize "
        "2) Data Retriever: To fetch the necessary data "
        "3) Data Analyzer: To process and analyze the data "
        "4) Chart Generator: To create the final visualization "
        "Based on the current state and progress, decide which agent should take action next. "
        "If the task is complete, respond with FINAL ANSWER."
    ),
)


def supervisor_node(
    state: ChartAgentState,
)  -> Command[Literal["intention_recognizer", "data_retriever", "data_analyzer", "chart_generator", END]]:
    # Initialize query from first message if not set
    if not state.query and len(state.messages) > 0:
        first_msg = state.messages[0]
        if isinstance(first_msg, HumanMessage):
            state.query = first_msg.content
    
    # If this is the first step, start with intention recognition
    if not state.current_agent:
        return Command(
            update={
                "current_agent": "intention_recognizer",
                "query": state.query,
            },
            goto="intention_recognizer"
        )
    
    # Get the last message to analyze
    last_message = state.messages[-1] if state.messages else None
    
    if last_message and "FINAL ANSWER" in last_message.content:
        return Command(goto=END)
    
    # Invoke supervisor to decide next step
    result = supervisor_agent.invoke(state)
    last_message = result["messages"][-1]
    
    # Determine next agent based on supervisor's decision
    content = last_message.content.lower()
    
    if "intention" in content or "understand" in content:
        next_agent = "intention_recognizer"
    elif "data retriev" in content or "fetch data" in content:
        next_agent = "data_retriever"
    elif "analyz" in content or "process data" in content:
        next_agent = "data_analyzer"
    elif "chart" in content or "visualiz" in content:
        next_agent = "chart_generator"
    elif "final answer" in content:
        return Command(goto=END)
    else:
        # Default progression based on typical workflow
        if state.current_agent == "intention_recognizer":
            next_agent = "data_retriever"
        elif state.current_agent == "data_retriever":
            next_agent = "data_analyzer"
        elif state.current_agent == "data_analyzer":
            next_agent = "chart_generator"
        else:
            next_agent = "intention_recognizer"  # Fallback
    
    # Add supervisor's reasoning as a message
    supervisor_message = HumanMessage(
        content=f"Supervisor: I'm directing this to the {next_agent.replace('_', ' ')} agent.",
        name="supervisor"
    )
     
    return Command(
        update={
            "messages": state.messages + [supervisor_message],
            "current_agent": next_agent,
            "query": state.query,
            "dataset": state.dataset,
            "chart_config": state.chart_config,
        },
        goto=next_agent
    )


# Intention recognizer agent and node
intention_agent = create_react_agent(
    llm,
    [],  # No specific tools, just for understanding intent
    prompt=make_system_prompt(
        "You are the intention recognition agent. Your job is to understand what the user wants to visualize. "
        "Determine if we need to: 1) retrieve data, 2) analyze data, 3) create a visualization, or 4) if we're done. "
        "If user query is clear enough for data retrieval, respond with 'need data' in your answer. "
        "If data is present and needs analysis, include 'analyze data' in your response. "
        "If data is analyzed and ready for visualization, include 'create chart' in your response. "
        "If the visualization is complete and satisfies the user's request, respond with FINAL ANSWER."
    ),
)


def intention_recognizer_node(
    state: ChartAgentState,
) -> Command[Literal["supervisor"]]:
    result = intention_agent.invoke(state)
    last_message = result["messages"][-1]
    
    # Wrap in a human message with agent name
    agent_message = HumanMessage(
        content=last_message.content, 
        name="intention_recognizer"
    )
    
    return Command(
        update={
            "messages": state.messages + [agent_message],
            "query": state.query,
            "dataset": state.dataset,
            "chart_config": state.chart_config,
        },
        goto="supervisor"
    )


# Data retriever agent and node
data_retriever_agent = create_react_agent(
    llm,
    [get_data_tool, tavily_tool],
    prompt=make_system_prompt(
        "You are the data retrieval agent. Your job is to fetch the data needed for visualization. "
        "Use the get_data_tool to retrieve specific datasets or tavily_tool for web research. "
        "Once you have the necessary data, include it in your response and mention 'analyze data' "
        "if further analysis is needed."
    ),
)


def data_retriever_node(
    state: ChartAgentState,
) -> Command[Literal["supervisor"]]:
    result = data_retriever_agent.invoke(state)
    last_message = result["messages"][-1]
    
    # This is where you would extract actual data from the response
    # For now, we'll use a placeholder
    sample_data = {"data": "sample_data_from_retrieval"}
    
    # Wrap in a human message with agent name
    agent_message = HumanMessage(
        content=last_message.content,
        name="data_retriever"
    )
    
    return Command(
        update={
            "messages": state.messages + [agent_message],
            "query": state.query,
            "dataset": sample_data,  # Update with retrieved data
            "chart_config": state.chart_config,
        },
        goto="supervisor"
    )


# Data analyzer agent and node
data_analyzer_agent = create_react_agent(
    llm,
    [analyze_data_tool, python_repl_tool],
    prompt=make_system_prompt(
        "You are the data analysis agent. Your job is to analyze the retrieved data "
        "to prepare it for visualization. Use the analyze_data_tool for specific analyses "
        "or python_repl_tool for custom data manipulation. Once the data is properly analyzed, "
        "include 'create chart' in your response."
    ),
)


def data_analyzer_node(
    state: ChartAgentState,
) -> Command[Literal["supervisor"]]:
    result = data_analyzer_agent.invoke(state)
    last_message = result["messages"][-1]
    
    # This is where you would update the dataset with analyzed data
    # For now, we'll use a placeholder
    analyzed_data = {"analyzed_data": "processed_data_ready_for_visualization"}
    
    # Wrap in a human message with agent name
    agent_message = HumanMessage(
        content=last_message.content,
        name="data_analyzer"
    )
    
    return Command(
        update={
            "messages": state.messages + [agent_message],
            "query": state.query,
            "dataset": analyzed_data,  # Update with analyzed data
            "chart_config": state.chart_config,
        },
        goto="supervisor"
    )


# Chart generator agent and node
chart_generator_agent = create_react_agent(
    llm,
    [generate_chart_config_tool, python_repl_tool],
    prompt=make_system_prompt(
        "You are the chart generation agent. Your job is to create visualizations from the analyzed data. "
        "Use the generate_chart_config_tool to create chart configurations or python_repl_tool for custom "
        "visualization code. When you have generated a satisfactory chart, include 'FINAL ANSWER' in your response."
    ),
)


def chart_generator_node(
    state: ChartAgentState,
) -> Command[Literal["supervisor"]]:
    result = chart_generator_agent.invoke(state)
    last_message = result["messages"][-1]
    
    # This is where you would extract chart configuration from the response
    # For now, we'll use a placeholder
    chart_config = {"type": "bar", "data": {"labels": [], "datasets": []}, "options": {}}
    
    # Wrap in a human message with agent name
    agent_message = HumanMessage(
        content=last_message.content,
        name="chart_generator"
    )
    
    return Command(
        update={
            "messages": state.messages + [agent_message],
            "query": state.query,
            "dataset": state.dataset,
            "chart_config": chart_config,  # Update with chart configuration
        },
        goto="supervisor"
    )


# Create the workflow with supervisor architecture
workflow = StateGraph(ChartAgentState)

# # Add all nodes
workflow.add_edge(START, "supervisor")
workflow.add_node("supervisor", supervisor_node)
workflow.add_node("intention_recognizer", intention_recognizer_node)
workflow.add_node("data_retriever", data_retriever_node)
workflow.add_node("data_analyzer", data_analyzer_node)
workflow.add_node("chart_generator", chart_generator_node)

# # Connect the workflow

workflow.add_edge("supervisor", END)
graph = workflow.compile()
