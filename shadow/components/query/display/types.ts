import {
  TableIcon,
  BarChartIcon,
  LineChartIcon,
  PieChartIcon,
  AlignLeftIcon,
  AreaChartIcon,
  TrendingUpIcon,
  LayoutGridIcon,
  FileTextIcon,
  FilterIcon,
  BarChart2Icon,
  HashIcon,
  GaugeIcon,
  ActivityIcon,
  MapIcon,
} from "lucide-react";

export interface QueryResult {
  rows: any[];
  columns: Array<{
    name: string;
    type: string;
  }>;
}

export interface ProcessedData<T = any> {
  isValid: boolean;
  error?: string;
  data?: T;
}

export interface ViewProcessor<T = any> {
  processData?: (data: QueryResult) => ProcessedData<T>;
  validateData?: (processedData: T) => { isValid: boolean; error?: string };
}

export interface ViewModeDefinition {
  id: string;
  name: string;
  icon: any;
  category: string;
  tooltip: any;
}

export interface QueryResultView<T = any> {
  Component: React.ComponentType<{ data: T }>;
  definition: ViewModeDefinition;
  processor: ViewProcessor<T>;
}

// ... VIEW_MODES definition ...
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
        "WITH sample_data AS (SELECT 'A' as category UNION SELECT 'B' UNION SELECT 'C') SELECT category as label, (RANDOM() * 100)::int as value FROM sample_data",
        "WITH months AS (SELECT unnest(ARRAY['Jan','Feb','Mar']) as month) SELECT month as label, (RANDOM() * 1000)::int as value FROM months",
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
        "展示数据随时间变化的趋势。需要返回: label列(时间/类别)和value列(数值)。例如: SELECT 日期 as label, 销售额 as value FROM 销售表",
      examples: [
        "WITH months AS (SELECT unnest(ARRAY['Jan','Feb','Mar','Apr','May']) as month) SELECT month as label, (RANDOM() * 100)::int as value FROM months",
        "WITH dates AS (SELECT generate_series('2023-01-01'::date, '2023-01-05'::date, '1 day'::interval) as date) SELECT date::text as label, (RANDOM() * 1000)::int as value FROM dates",
      ],
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
    category: "basic",
    tooltip: {
      description: "Display data as a number",
      examples: ["Numerical data visualization", "Data representation"],
    },
  },
  {
    id: "gauge",
    name: "Gauge",
    icon: GaugeIcon,
    category: "basic",
    tooltip: {
      description: "Display data as a gauge chart",
      examples: ["Performance monitoring", "Data visualization"],
    },
  },
  {
    id: "progress",
    name: "Progress",
    icon: ActivityIcon,
    category: "basic",
    tooltip: {
      description: "Display data as a progress bar",
      examples: ["Task completion tracking", "Data visualization"],
    },
  },
  {
    id: "map",
    name: "Map",
    icon: MapIcon,
    category: "basic",
    tooltip: {
      description: "Display data as a map",
      examples: ["Geographical data visualization", "Data mapping"],
    },
  },
];
