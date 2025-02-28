export enum SourceType {
    CSV = 'csv',
    DATABASE = 'database',
    RAG = 'rag'
}

export interface Source {
    id: string;
    type: SourceType;
    name: string;
    path: string;
    description?: string;
    metadata?: Record<string, any>;
}

export interface SourceHandler {
    type: SourceType;
    canHandle(source: Source): boolean;
    query(source: Source, query: string): Promise<QueryResult>;
}

export interface QueryResult {
    data: any;
    type: 'chart' | 'text' | 'table';
    metadata?: Record<string, any>;
}

// 添加意图相关的类型定义
export interface QueryIntent {
    type: string;
    aspects: string[];
    filters?: Record<string, any>;
}

// 添加图表相关的类型定义
export interface ChartConfig {
    type: 'line' | 'bar' | 'pie' | 'radar' | 'heatmap';
    options?: Record<string, any>;
} 