"use client";
import React from "react";
import { ViewFactory } from "@/components/query/display/view-factory";

// 基于类型进行展示
export const Visualization: React.FC<{
  viewId: string;
  sqlContent: string;
  sqlVariables: string;
  databaseId: string;
  llmConfig?: unknown;
}> = ({ viewId, sqlContent, sqlVariables, databaseId, llmConfig }) => {
  // 创建并返回选中的视图
  return (
    <ViewFactory
      viewId={viewId}
      sqlContent={sqlContent}
      sqlVariables={sqlVariables}
      databaseId={databaseId}
      llmConfig={llmConfig}
    />
  );
};
