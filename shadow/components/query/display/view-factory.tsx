import { VIEW_MODES, QueryResultView } from "./types";
import { createTableView } from "./views/table-view";
import { createBarView } from "./views/bar-view";
import { VisualizationErrorView } from "./views/error-view";
import { createLineView } from "./views/line-view";

export class QueryViewFactory {
  private views: Map<string, QueryResultView>;

  constructor() {
    this.views = new Map();
    this.registerDefaultViews();
  }
  private registerDefaultViews() {
    const tableDefinition = VIEW_MODES.find((m) => m.id === "table")!;
    const barDefinition = VIEW_MODES.find((m) => m.id === "bar")!;
    const lineDefinition = VIEW_MODES.find((m) => m.id === "line")!;

    const tableView = createTableView(tableDefinition);
    const barView = createBarView(barDefinition);
    const lineView = createLineView(lineDefinition);

    this.registerView("table", tableView);
    this.registerView("bar", barView);
    this.registerView("line", lineView);
  }

  private registerView(id: string, view: QueryResultView) {
    this.views.set(id, {
      ...view,
      Component: this.wrapWithProcessing(view.Component, view.processor),
    });
  }

  wrapWithProcessing(
    WrappedComponent: React.ComponentType<any>,
    processor: ViewProcessor
  ): React.ComponentType<QueryResult> {
    return function ProcessingWrapper(props: QueryResult) {
      // 处理数据
      const processedData = processor.processData(props);
      if (!processedData.isValid) {
        return (
          <VisualizationErrorView
            error={processedData.error || "Failed to process data"}
          />
        );
      }

      // 验证数据
      const validationResult = processor.validateData(processedData.data);
      if (!validationResult.isValid) {
        return (
          <QueryErrorView error={validationResult.error || "Invalid data"} />
        );
      }

      // 渲染组件
      return <WrappedComponent data={processedData.data} />;
    };
  }

  getView(type: string): React.ComponentType<QueryResult> {
    const view = this.views.get(type);
    return view ? view.Component : this.views.get("table")!.Component;
  }

  getViewDefinition(type: string): ViewModeDefinition | undefined {
    return this.views.get(type)?.definition;
  }

  getViewsByCategory(category: "basic" | "other"): ViewModeDefinition[] {
    return VIEW_MODES.filter((mode) => mode.category === category);
  }

  getTooltipContent(viewId: string): ViewTooltipContent | undefined {
    return VIEW_MODES.find((mode) => mode.id === viewId)?.tooltip;
  }
}

export const queryViewFactory = new QueryViewFactory();
