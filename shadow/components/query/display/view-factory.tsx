"use client";

import { QueryResult, QueryResultView, ViewModeDefinition } from "./types";
import { VisualizationErrorView } from "./views/error-view";
import { VIEW_MODES } from "./types";
import { createBarChartView } from "./views/bar-view";
import { createTableView } from "./views/table-view";
import { createLineView } from "./views/line-view";
import { createPieChartView } from "./views/pie-view";
import { createNumberView } from "./views/number-view";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const views: Map<string, QueryResultView<any>> = new Map();

export function register<T>(viewId: string, view: QueryResultView<T>) {
  views.set(viewId, view);
}

export function ViewFactory({
  viewId,
  queryResult,
  config,
}: {
  viewId: string;
  queryResult: QueryResult;
  config?: unknown;
}) {
  const [processedData, setProcessedData] = React.useState<unknown>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const processData = async () => {
      setLoading(true);
      const view = views.get(viewId);

      if (!view) {
        setError(`View ${viewId} not found`);
        return;
      }

      try {
        const processedResult = view.processor.processData
          ? await view.processor.processData(queryResult, config)
          : { isValid: true, data: queryResult };

        if (!processedResult?.isValid || !processedResult?.data) {
          setError(processedResult?.error || "Invalid data");
          return;
        }

        const validation = view.processor.validateData
          ? view.processor.validateData(processedResult.data)
          : { isValid: true };

        if (!validation?.isValid) {
          setError(validation?.error || "Data validation failed");
          return;
        }

        setProcessedData(processedResult.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    processData();
  }, [viewId, queryResult, config]);

  if (error) {
    return <VisualizationErrorView error={error} />;
  }

  if (loading || !processedData) {
    return <LoadingView />;
  }

  const view = views.get(viewId);
  return <view.Component data={processedData} />;
}

// 创建工厂实例

register(
  "bar",
  createBarChartView(
    VIEW_MODES.find((mode) => mode.id === "bar") as ViewModeDefinition
  )
);
register(
  "table",
  createTableView(
    VIEW_MODES.find((mode) => mode.id === "table") as ViewModeDefinition
  )
);
register(
  "line",
  createLineView(
    VIEW_MODES.find((mode) => mode.id === "line") as ViewModeDefinition
  )
);
register(
  "pie",
  createPieChartView(
    VIEW_MODES.find((mode) => mode.id === "pie") as ViewModeDefinition
  )
);
register(
  "number",
  createNumberView(
    VIEW_MODES.find((mode) => mode.id === "number") as ViewModeDefinition
  )
);

export function LoadingView() {
  return <div>Loading...</div>;
}

