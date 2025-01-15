import { register } from "../query/display/view-base";
import { ViewFactory } from "../query/display/view-factory";
import { createLLMView } from "./views/llm-view";
import { views } from "@/components/query/display/view-base";
import { FileTextIcon } from "lucide-react";
import { ViewModeDefinition } from "../query/display/types";
import { DashboardSection } from "@/types/base";
import React from "react";

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

views.set(
  "llm",
  createLLMView(
    DashboardViewModeDefinitions.find(
      (mode) => mode.id === "llm"
    ) as ViewModeDefinition
  )
);

export { views };
export const DashboardFactory: React.FC<{
  config: DashboardSection;
  dashboardViewId: string;
}> = ({ config, dashboardViewId }) => {
  const { sqlContent, variables, databaseId, viewId, viewMode } = config;
  const [isExecuting, setIsExecuting] = React.useState(true);

  // 第一次渲染时自动执行
  React.useEffect(() => {
    setIsExecuting(true);
  }, [dashboardViewId]);

  // 没有选择视图时显示提示
  if (!viewId) {
    return (
      <div className='flex items-center justify-center h-full text-muted-foreground'>
        请选择合适的视图进行展示
      </div>
    );
  }

  return (
    <ViewFactory
      viewId={viewId}
      sqlContent={sqlContent}
      sqlVariables={variables}
      databaseId={databaseId}
      isExecuting={isExecuting}
    />
  );
};
