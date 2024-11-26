import { Prisma } from "@prisma/client";

// 数据源
\

export interface Datasource {
  id: string;
  type: string; // 可以扩展为 'PostgreSQL' | 'MySQL' | 'Oracle' 等
  displayName: string;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password: string;
  schemas: "All" | string[]; // 'All' 或者特定的 schema 列表
  useSSL: boolean;
}

export interface PostgreSQLDatasource extends Datasource {
  type: "PostgreSQL";
}

export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  comment?: string;
  key?: string;
}

export interface Table {
  name: string;
  columns: TableColumn[];
}

export interface Schema {
  name: string;
  tables: Table[];
}

// dashboard 组件类型
export type SectionType = "Header" | "Text" | "LLM" | "OTHER";

export interface DashboardSection {
  id: string;

  viewId: string;
  // 获取配置，只获取不进行修改
  sqlContent: string;
  sqlVariables: Variable[];
  databaseId: string;

  // 展示
  viewMode: string;
  processData?: <T = unknown>(data: T) => T;
  // 控制执行，这里一般为true
  isExecuting: boolean;

  // 基于大模型生成，后期可能进行修改
  llmConfig?: {
    llmType: "imitate" | "generate";
    prompt: string;
  };
}


// 可视化组件
export type Visualization = Prisma.visualizationGetPayload<{}>;

export interface Variable {
  id: string;
  name: string;
  value: string;
  type: "string" | "number" | "boolean" | "date";
}

