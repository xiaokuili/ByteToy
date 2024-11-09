import { TableView } from "@/components/query/display/views/table-view";
import { BarViewResult } from "./views/bar-view";
import {
  TableIcon,
  BarChartIcon,
  LineChartIcon,
  PieChartIcon,
  AlignLeftIcon,
  AreaChartIcon,
  TrendingUpIcon,
  FileTextIcon,
  BarChart2Icon,
  GaugeIcon,
  ActivityIcon,
  MapIcon,
  FilterIcon,
  HashIcon,
  LayoutGridIcon,
} from "lucide-react";

export interface QueryResult {
  rows: any[];
  columns: Array<{
    name: string;
    type: string;
  }>;
}

export interface ViewModeDefinition {
  id: string;
  name: string;
  icon: any;
  category: 'basic' | 'other';
}

interface QueryResultView {
  Component: React.ComponentType<QueryResult>;
  definition: ViewModeDefinition;
}

export const VIEW_MODES: ViewModeDefinition[] = [
  { id: "table", name: "Table", icon: TableIcon, category: 'basic' },
  { id: "bar", name: "Bar", icon: BarChartIcon, category: 'basic' },
  { id: "line", name: "Line", icon: LineChartIcon, category: 'basic' },
  { id: "pie", name: "Pie", icon: PieChartIcon, category: 'basic' },
  { id: "row", name: "Row", icon: AlignLeftIcon, category: 'basic' },
  { id: "area", name: "Area", icon: AreaChartIcon, category: 'basic' },
  { id: "combo", name: "Combo", icon: TrendingUpIcon, category: 'basic' },
  { id: "pivot", name: "Pivot Table", icon: LayoutGridIcon, category: 'basic' },
  { id: "trend", name: "Trend", icon: TrendingUpIcon, category: 'basic' },
  { id: "funnel", name: "Funnel", icon: FilterIcon, category: 'basic' },
  { id: "detail", name: "Detail", icon: FileTextIcon, category: 'basic' },
  { id: "waterfall", name: "Waterfall", icon: BarChart2Icon, category: 'basic' },
  { id: "number", name: "Number", icon: HashIcon, category: 'other' },
  { id: "gauge", name: "Gauge", icon: GaugeIcon, category: 'other' },
  { id: "progress", name: "Progress", icon: ActivityIcon, category: 'other' },
  { id: "map", name: "Map", icon: MapIcon, category: 'other' },
];

export class QueryViewFactory {
  private views: Map<string, QueryResultView>;

  constructor() {
    this.views = new Map();
    this.registerDefaultViews();
  }

  private registerDefaultViews() {
    this.registerView("table", new TableView(), VIEW_MODES.find(m => m.id === "table")!);
    this.registerView("bar", new BarViewResult(), VIEW_MODES.find(m => m.id === "bar")!);
  }

  private registerView(id: string, view: any, definition: ViewModeDefinition) {
    this.views.set(id, {
      Component: view.Component,
      definition
    });
  }

  getView(type: string): React.ComponentType<ViewProps> {
    const view = this.views.get(type);
    return view ? view.Component : this.views.get("table")!.Component;
  }

  getViewDefinition(type: string): ViewModeDefinition | undefined {
    return this.views.get(type)?.definition;
  }

  getViewsByCategory(category: 'basic' | 'other'): ViewModeDefinition[] {
    return VIEW_MODES.filter(mode => mode.category === category);
  }
}

export const queryViewFactory = new QueryViewFactory();
