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

export type SectionType = "Header" | "Text" | "Other";

export interface DashboardSection extends Visualization {
  type: SectionType;
  header?: string;
  text?: string;
  llmConfig?: {
    llmType: "imitate" | "generate";
    prompt: string;
  };
}

export interface Visualization {
  id: string;
  name: string;
  datasourceId: string;
  sqlContent: string;
  viewMode: string;
  viewParams: Record<string, unknown>;
  sqlVariables: Variable[];
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
export type SectionType = "LLM" | "PIE" | "CHART" | "TABLE";

export interface Variable {
  id: string;
  name: string;
  value: string;
  type: "string" | "number" | "boolean" | "date";
}

export interface DatabaseSource {
  id: string;
  sql: string;
}
