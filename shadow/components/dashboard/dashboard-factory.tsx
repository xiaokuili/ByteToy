import { register } from "../query/display/view-base";
import { ViewFactory } from "../query/display/view-factory";
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
  config: DashboardSection;
}> = ({ config }) => {
  // 创建并返回选中的视图
  // 添加日志来追踪 props 变化

  const { sqlContent, variables, databaseId, viewId, viewMode } = config;
  // 添加调试日志
  return !viewId ? (
    <div className='flex items-center justify-center h-full text-muted-foreground'>
      请选择合适的试图进行展示
    </div>
  ) : (
    <ViewFactory
      sqlContent={sqlContent}
      sqlVariables={variables}
      databaseId={databaseId}
      viewId={viewMode}
      llmConfig={config.llmConfig}
      isExecuting={true}
    />
  );
};
