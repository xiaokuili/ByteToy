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

export interface ViewTooltipContent {
  title?: string;
  description: string;
  examples?: string[];
}

export interface ViewModeDefinition {
  id: string;
  name: string;
  icon: any;
  category: "basic" | "other";
  tooltip: ViewTooltipContent;
}

interface QueryResultView {
  Component: React.ComponentType<QueryResult>;
  definition: ViewModeDefinition;
}

export const VIEW_MODES: ViewModeDefinition[] = [
  {
    id: "table",
    name: "Table",
    icon: TableIcon,
    category: "basic",
    tooltip: {
      description: "Display data in a tabular format with rows and columns",
      examples: ["Raw data viewing", "Detailed records"],
    },
  },
  {
    id: "bar",
    name: "Bar",
    icon: BarChartIcon,
    category: "basic",
    tooltip: {
      title: "Bar Chart Requirements",
      description:
        "Compare values across categories using rectangular bars. SQL should return label and value columns.",
      examples: [
        "SELECT category as label, COUNT(*) as value FROM products GROUP BY category",
        "SELECT department as label, SUM(salary) as value FROM employees GROUP BY department",
      ],
    },
  },
  {
    id: "line",
    name: "Line",
    icon: LineChartIcon,
    category: "basic",
    tooltip: {
      description:
        "Display data as a series of points connected by straight lines",
      examples: ["Time series analysis", "Trend analysis"],
    },
  },
  {
    id: "pie",
    name: "Pie",
    icon: PieChartIcon,
    category: "basic",
    tooltip: {
      description: "Display data as a circular chart divided into slices",
      examples: ["Market share analysis", "Product distribution"],
    },
  },
  {
    id: "row",
    name: "Row",
    icon: AlignLeftIcon,
    category: "basic",
    tooltip: {
      description: "Display data in a single row",
      examples: ["Single record viewing", "Summary data"],
    },
  },
  {
    id: "area",
    name: "Area",
    icon: AreaChartIcon,
    category: "basic",
    tooltip: {
      description: "Display data as a series of connected areas",
      examples: [
        "Geographical data visualization",
        "Population density analysis",
      ],
    },
  },
  {
    id: "combo",
    name: "Combo",
    icon: TrendingUpIcon,
    category: "basic",
    tooltip: {
      description: "Display data as a combination of different chart types",
      examples: ["Hybrid data visualization", "Comparative analysis"],
    },
  },
  {
    id: "pivot",
    name: "Pivot Table",
    icon: LayoutGridIcon,
    category: "basic",
    tooltip: {
      description: "Display data in a pivot table format",
      examples: ["Data summarization", "Cross-tabulation"],
    },
  },
  {
    id: "trend",
    name: "Trend",
    icon: TrendingUpIcon,
    category: "basic",
    tooltip: {
      description: "Display data as a trend line",
      examples: ["Time series analysis", "Trend analysis"],
    },
  },
  {
    id: "funnel",
    name: "Funnel",
    icon: FilterIcon,
    category: "basic",
    tooltip: {
      description: "Display data as a funnel chart",
      examples: ["Sales funnel analysis", "Conversion rate analysis"],
    },
  },
  {
    id: "detail",
    name: "Detail",
    icon: FileTextIcon,
    category: "basic",
    tooltip: {
      description: "Display detailed data",
      examples: ["Detailed record viewing", "Data exploration"],
    },
  },
  {
    id: "waterfall",
    name: "Waterfall",
    icon: BarChart2Icon,
    category: "basic",
    tooltip: {
      description: "Display data as a waterfall chart",
      examples: ["Cost analysis", "Data visualization"],
    },
  },
  {
    id: "number",
    name: "Number",
    icon: HashIcon,
    category: "other",
    tooltip: {
      description: "Display data as a number",
      examples: ["Numerical data visualization", "Data representation"],
    },
  },
  {
    id: "gauge",
    name: "Gauge",
    icon: GaugeIcon,
    category: "other",
    tooltip: {
      description: "Display data as a gauge chart",
      examples: ["Performance monitoring", "Data visualization"],
    },
  },
  {
    id: "progress",
    name: "Progress",
    icon: ActivityIcon,
    category: "other",
    tooltip: {
      description: "Display data as a progress bar",
      examples: ["Task completion tracking", "Data visualization"],
    },
  },
  {
    id: "map",
    name: "Map",
    icon: MapIcon,
    category: "other",
    tooltip: {
      description: "Display data as a map",
      examples: ["Geographical data visualization", "Data mapping"],
    },
  },
];

export class QueryViewFactory {
  private views: Map<string, QueryResultView>;

  constructor() {
    this.views = new Map();
    this.registerDefaultViews();
  }

  private registerDefaultViews() {
    this.registerView(
      "table",
      new TableView(),
      VIEW_MODES.find((m) => m.id === "table")!
    );
    this.registerView(
      "bar",
      new BarViewResult(),
      VIEW_MODES.find((m) => m.id === "bar")!
    );
  }

  private registerView(id: string, view: any, definition: ViewModeDefinition) {
    this.views.set(id, {
      Component: view.Component,
      definition,
    });
  }

  getView(type: string): React.ComponentType<ViewProps> {
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
