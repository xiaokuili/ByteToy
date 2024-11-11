import {
  LLM_VIEW_MODES,
  QueryResult,
  QueryResultView,
  ViewModeDefinition,
} from "./types";
import { VisualizationErrorView } from "./views/error-view";
import { VIEW_MODES } from "./types";
import { createBarChartView } from "./views/bar-view";
import { createTableView } from "./views/table-view";
import { createLineView } from "./views/line-view";
import { createPieChartView } from "./views/pie-view";
import { createNumberView } from "./views/number-view";
import { createLLMView } from "./views/llm-view";
import React from "react";

export class ViewFactory {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private views: Map<string, QueryResultView<any>> = new Map();

  register<T>(viewId: string, view: QueryResultView<T>) {
    this.views.set(viewId, view);
  }

  createView(
    viewId: string,
    queryResult: QueryResult
  ): React.ReactElement | null {
    const view = this.views.get(viewId);

    if (!view) {
      return <VisualizationErrorView error={`View ${viewId} not found`} />;
    }

    const processedResult = view.processor.processData
      ? view.processor.processData(queryResult)
      : { isValid: true, data: queryResult };

    if (!processedResult?.isValid || !processedResult?.data) {
      return (
        <VisualizationErrorView
          error={processedResult?.error || "Invalid data"}
        />
      );
    }

    const validation = view.processor.validateData
      ? view.processor.validateData(processedResult.data)
      : { isValid: true };

    if (!validation?.isValid) {
      return (
        <VisualizationErrorView
          error={validation?.error || "Data validation failed"}
        />
      );
    }
    return <view.Component data={processedResult.data} />;
  }
}

// 创建工厂实例
export const viewFactory = new ViewFactory();

viewFactory.register(
  "bar",
  createBarChartView(
    VIEW_MODES.find((mode) => mode.id === "bar") as ViewModeDefinition
  )
);
viewFactory.register(
  "table",
  createTableView(
    VIEW_MODES.find((mode) => mode.id === "table") as ViewModeDefinition
  )
);
viewFactory.register(
  "line",
  createLineView(
    VIEW_MODES.find((mode) => mode.id === "line") as ViewModeDefinition
  )
);
viewFactory.register(
  "pie",
  createPieChartView(
    VIEW_MODES.find((mode) => mode.id === "pie") as ViewModeDefinition
  )
);
viewFactory.register(
  "number",
  createNumberView(
    VIEW_MODES.find((mode) => mode.id === "number") as ViewModeDefinition
  )
);
viewFactory.register(
  "llm",
  createLLMView(
    LLM_VIEW_MODES.find((mode) => mode.id === "llm") as ViewModeDefinition
  )
);
