"use client"
import { chartDictionary, InputType } from "@/components/chat/charts";
import { useState } from "react";
import { exampleData } from "@/components/chat/charts/BarChart"
export default function Home() {
  // 选择要渲染的图表类型
  const [chartType, setChartType] = useState<string>("bar");
  const [inputData, setInputData] = useState<string>("");
  const [chartData, setChartData] = useState<InputType>({
    data: exampleData.data as any,
  })
  
  // 获取对应的组件和示例数据
  const chartInfo = chartDictionary[chartType as keyof typeof chartDictionary];
  const ChartComponent = chartInfo.component;
  
  
  const handleChartTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChartType(e.target.value);
    // 更新示例数据为所选图表类型的示例数据
    const newChartInfo = chartDictionary[e.target.value as keyof typeof chartDictionary];
    setChartData(newChartInfo.exampleData as InputType);
  };
  
  const handleDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputData(e.target.value);
  };
  
  const handleApplyData = () => {
    try {
      const parsedData = JSON.parse(inputData);
      console.log(parsedData);
      setChartData({
        data: parsedData as any
      });
    } catch (error) {
      alert("JSON格式错误，请检查输入数据");
      console.error("JSON parsing error:", error);
    }
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ChartSay</h1>
      
      <div className="mb-4">
        <label className="block mb-2">图表类型:</label>
        <select 
          value={chartType} 
          onChange={handleChartTypeChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {Object.keys(chartDictionary).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">数据:</label>
        <textarea 
          value={inputData} 
          onChange={handleDataChange}
          placeholder="输入JSON数据"
          className="w-full p-2 border border-gray-300 rounded-md h-32"
        />
        <button 
          onClick={handleApplyData}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          应用数据
        </button>
      </div>
      
      
      <div className="mt-4">
        <ChartComponent data={chartData.data as any} />
      </div>
    </div>
  );
}