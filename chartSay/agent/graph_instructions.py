import requests
from typing import Dict



barGraphIntstruction = '''

  Where data is: {
    labels: string[]
    values: {\data: number[], label: string}[]
  }

// Examples of usage:
Each label represents a column on the x axis.
Each array in values represents a different entity. 

Here we are looking at average income for each month.
1. data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  values: [{data:[21.5, 25.0, 47.5, 64.8, 105.5, 133.2], label: 'Income'}],
}

Here we are looking at the performance of american and european players for each series. Since there are two entities, we have two arrays in values.
2. data = {
  labels: ['series A', 'series B', 'series C'],
  values: [{data:[10, 15, 20], label: 'American'}, {data:[20, 25, 30], label: 'European'}],
}
'''

horizontalBarGraphIntstruction = '''

  Where data is: {
    labels: string[]
    values: {\data: number[], label: string}[]
  }

// Examples of usage:
Each label represents a column on the x axis.
Each array in values represents a different entity. 

Here we are looking at average income for each month.
1. data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  values: [{data:[21.5, 25.0, 47.5, 64.8, 105.5, 133.2], label: 'Income'}],
}

Here we are looking at the performance of american and european players for each series. Since there are two entities, we have two arrays in values.
2. data = {
  labels: ['series A', 'series B', 'series C'],
  values: [{data:[10, 15, 20], label: 'American'}, {data:[20, 25, 30], label: 'European'}],
}

'''


lineGraphIntstruction = '''

  Where data is: {
  xValues: number[] | string[]
  yValues: { data: number[]; label: string }[]
}

// Examples of usage:

Here we are looking at the momentum of a body as a function of mass.
1. data = {
  xValues: ['2020', '2021', '2022', '2023', '2024'],
  yValues: [
    { data: [2, 5.5, 2, 8.5, 1.5]},
  ],
}

Here we are looking at the performance of american and european players for each year. Since there are two entities, we have two arrays in yValues.
2. data = {
  xValues: ['2020', '2021', '2022', '2023', '2024'],
  yValues: [
    { data: [2, 5.5, 2, 8.5, 1.5], label: 'American' },
    { data: [2, 5.5, 2, 8.5, 1.5], label: 'European' },
  ],
}
'''

pieChartIntstruction = '''

  Where data is: {
    labels: string
    values: number
  }[]

// Example usage:
 data = [
        { id: 0, value: 10, label: 'series A' },
        { id: 1, value: 15, label: 'series B' },
        { id: 2, value: 20, label: 'series C' },
      ],
'''

scatterPlotIntstruction = '''
Where data is: {
  series: {
    data: { x: number; y: number; id: number }[]
    label: string
  }[]
}

// Examples of usage:
1. Here each data array represents the points for a different entity. 
We are looking for correlation between amount spent and quantity bought for men and women.
data = {
  series: [
    {
      data: [
        { x: 100, y: 200, id: 1 },
        { x: 120, y: 100, id: 2 },
        { x: 170, y: 300, id: 3 },
      ],
      label: 'Men',
    },
    {
      data: [
        { x: 300, y: 300, id: 1 },
        { x: 400, y: 500, id: 2 },
        { x: 200, y: 700, id: 3 },
      ],
      label: 'Women',
    }
  ],
}

2. Here we are looking for correlation between the height and weight of players.
data = {
  series: [
    {
      data: [
        { x: 180, y: 80, id: 1 },
        { x: 170, y: 70, id: 2 },
        { x: 160, y: 60, id: 3 },
      ],
      label: 'Players',
    },
  ],
}

// Note: Each object in the 'data' array represents a point on the scatter plot.
// The 'x' and 'y' values determine the position of the point, and 'id' is a unique identifier.
// Multiple series can be represented, each as an object in the outer array.
'''


from typing import List, Dict, Union, Any

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


def graph_instructions_with_type(graph_type: str) -> Dict:

    if graph_type == "bar":
        return barGraphIntstruction
    elif graph_type == "horizontalBar":
        return horizontalBarGraphIntstruction
    elif graph_type == "line":
        return lineGraphIntstruction
    elif graph_type == "pie":
        return pieChartIntstruction
    elif graph_type == "scatter":
        return scatterPlotIntstruction
    else:
        raise ValueError(f"Invalid graph type: {graph_type}")
