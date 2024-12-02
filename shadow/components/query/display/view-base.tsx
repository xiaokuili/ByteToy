"use client";

import { QueryResultView, ViewModeDefinition } from "./types";
import { VIEW_MODES } from "./types";
import { createBarChartView } from "./views/bar-view";
import { createTableView } from "./views/table-view";
import { createLineView } from "./views/line-view";
import { createPieChartView } from "./views/pie-view";
import { createNumberView } from "./views/number-view";
import { createEmptyView } from "./views/empty-view";
import { createGaugeView } from "./views/gauge-view";
import { createMetricView } from "./views/metric-view";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const views: Map<string, QueryResultView<any>> = new Map();

export function register<T>(viewId: string, view: QueryResultView<T>) {
  views.set(viewId, view);
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
register(
  "empty",
  createEmptyView(
    VIEW_MODES.find((mode) => mode.id === "empty") as ViewModeDefinition
  )
);

register(
  "gauge",
  createGaugeView(
    VIEW_MODES.find((mode) => mode.id === "gauge") as ViewModeDefinition
  )
);
register(
  "metric",
  createMetricView(
    VIEW_MODES.find((mode) => mode.id === "metric") as ViewModeDefinition
  )
);

export { views };
