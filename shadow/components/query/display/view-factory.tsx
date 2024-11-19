import { useViewProcessor } from "@/hook/use-view-processor";
import { QueryResult } from "../types";
import { views } from "./view-base";
import { useQueryExecution } from "@/hook/use-queryexecution";
import { useEffect } from "react";
import React from "react";

export function ViewFactory({
  viewId,
  config,
}: {
  viewId: string;
  config?: unknown;
}) {
  // 使用 key 来强制整个组件树重新创建
  return (
    <React.Fragment key={`${viewId}-${JSON.stringify(config)}`}>
      <ViewFactoryInner viewId={viewId} config={config} />
    </React.Fragment>
  );
}

// 内部组件处理实际的渲染逻辑
function ViewFactoryInner({
  viewId,
  config,
}: {
  viewId: string;
  config?: unknown;
}) {
  const { queryResult, queryError } = useQueryExecution(config);

  const { processedData, error, loading } = useViewProcessor(
    viewId,
    queryResult,
    config
  );
  const ViewComponent = views.get(viewId);

  return queryError ? (
    <VisualizationErrorView error={queryError} />
  ) : loading || !processedData ? (
    <LoadingView />
  ) : (
    <ViewComponent.Component data={processedData} />
  );
}

export function LoadingView() {
  return <div>Loading...</div>;
}

export function QueryErrorView({ error }: { error: string }) {
  return <div>{error}</div>;
}

export function VisualizationErrorView({ error }: { error: string }) {
  return <div>{error}</div>;
}
