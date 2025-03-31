import requests
from typing import  Dict, Any

def infer_type(value: Any) -> str:
    if isinstance(value, str):
        return 'str'
    elif isinstance(value, int):
        return 'int'
    elif isinstance(value, float):
        return 'float'
    elif isinstance(value, list):
        if value:
            return f'List[{infer_type(value[0])}]'
        else:
            return 'List'
    elif isinstance(value, dict):
        return 'Dict[str, Any]'
    else:
        return 'Any'

def generate_structure(data: Dict[str, Any], indent: str = '') -> str:
    result = '{\n'
    for key, value in data.items():
        if isinstance(value, dict):
            result += f'{indent}    {key}: {generate_structure(value, indent + "    ")}'
        elif isinstance(value, list) and value and isinstance(value[0], dict):
            result += f'{indent}    {key}: List[{generate_structure(value[0], indent + "    ")}]'
        else:
            result += f'{indent}    {key}: {infer_type(value)},\n'
    result += f'{indent}}}'
    return result

# 示例数据
example_data = {
    "data": {
        "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        "values": [
            {
                "data": [21.5, 25, 47.5, 64.8, 105.5, 133.2],
                "label": "Income"
            }
        ]
    }
}



def graph_instructions(graph_type: str) -> Dict:
    """
    获取图表指令
    
    Args:
        graph_type: 图表类型
        
    Returns:
        提示词两部分组成，第一部分是格式， 第二部分是例子 
        
    Raises:
        ValueError: 当图表类型无效时
        RequestError: 当API请求失败时
    """

    response = requests.get(
            "http://localhost:3000/api/chart",
            timeout=5  # 添加超时设置
    )
    response.raise_for_status()  # 检查响应状态
        
    data = response.json()
    if graph_type not in data:
        raise ValueError(f"Invalid graph type: {graph_type}")
    if "exampleData" not in data[graph_type]:
        raise ValueError(f"No example data for graph type: {graph_type}")
    if "description" not in data[graph_type]:
        raise ValueError(f"No description for graph type: {graph_type}")
    
    example_data = data[graph_type]["exampleData"]
    description = data[graph_type]["description"]
    structure = generate_structure(example_data)

            
    return f"where data is: {structure}\n examples: {example_data}\n {description}"

