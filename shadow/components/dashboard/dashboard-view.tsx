import { IViewFactory } from "../query/display/view-factory";
import { QueryResultView } from "../query/display/types";
import { viewFactory } from "../query/display/view-factory";
import { createLLMView } from "./views/llm-view";
import { FileTextIcon } from "lucide-react";
import { ViewModeDefinition } from "../query/display/types";

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

const dashboardViewFactory = viewFactory;

dashboardViewFactory.register(
  "llm",
  createLLMView(
    DashboardViewModeDefinitions.find(
      (mode) => mode.id === "llm"
    ) as ViewModeDefinition
  )
);

export const DashboardVisualization: React.FC<{
  viewId: string;
  queryResult: QueryResult;
}> = ({ viewId, queryResult }) => {
  // 创建并返回选中的视图
  return dashboardViewFactory.createView(viewId, queryResult);
};
