import { QueryResult } from "../query/display/types";
import { register, ViewFactory } from "../query/display/view-factory";
import { createLLMView } from "./views/llm-view";
import { FileTextIcon } from "lucide-react";
import { ViewModeDefinition } from "../query/display/types";
import { DashboardSection } from "@/types/base";

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
  queryResult: QueryResult;
  config: DashboardSection;
}> = ({ dashboardViewId, queryResult, config }) => {
  // 创建并返回选中的视图
  console.log("DashboardFactory render:", {
    dashboardViewId,
    queryResult,
    config,
    timestamp: new Date().toISOString(),
  });
  return (
    <ViewFactory
      viewId={dashboardViewId}
      queryResult={queryResult}
      config={config}
    />
  );
};
