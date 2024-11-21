import { QueryResult } from "../query/display/types";
import { register, views } from "../query/display/view-base";
import { ViewFactory } from "../query/display/view-factory";
import { createLLMView } from "./views/llm-view";
import { FileTextIcon } from "lucide-react";
import { ViewModeDefinition } from "../query/display/types";
import { DashboardSection } from "@/types/base";
import { useEffect } from "react";
const DashboardViewModeDefinitions: ViewModeDefinition[] = [
  {
    id: "llm",
    name: "LLM",
    icon: FileTextIcon,
    category: "basic",
    tooltip: {
      description: "Display LLM chat completion results",
      examples: ["Natural language processing", "AI-powered text generation"],
    },
  },
];

register(
  "llm",
  createLLMView(
    DashboardViewModeDefinitions.find(
      (mode) => mode.id === "llm"
    ) as ViewModeDefinition
  )
);

export const DashboardFactory: React.FC<{
  dashboardViewId: string;
  config: DashboardSection;
}> = ({ dashboardViewId, config }) => {
  // 创建并返回选中的视图
  // 添加日志来追踪 props 变化

  const factoryKey = `view-factory-${dashboardViewId}-${Date.now()}`;

  // 添加调试日志
  useEffect(() => {
    console.log("DashboardFactory mounted with key:", factoryKey);
    return () => {
      console.log("DashboardFactory unmounted with key:", factoryKey);
    };
  }, [factoryKey]);
  return (
    // <ViewFactory
    //   viewId={dashboardViewId}
    //   llmConfig={config}
    //   key={`view-factory-${dashboardViewId}`} // 确保 Factory 本身不会被复用
    // />
    <>  </>
  );
};
