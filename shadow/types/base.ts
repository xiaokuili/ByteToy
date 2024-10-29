
export interface Datasource {
    type: string; // 可以扩展为 'PostgreSQL' | 'MySQL' | 'Oracle' 等
    displayName: string;
    host: string;
    port: number;
    databaseName: string;
    username: string;
    password: string;
    schemas: 'All' | string[]; // 'All' 或者特定的 schema 列表
    useSSL: boolean;
  }


export interface PostgreSQLDatasource extends Datasource {
    type: 'PostgreSQL';
}

interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  comment?: string;
  key?: string;
}

interface Table {
  name: string;
  columns: TableColumn[];
}

interface Schema {
  name: string;
  tables: Table[];
}