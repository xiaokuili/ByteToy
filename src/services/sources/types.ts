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
    query(source: Source, query: string): Promise<any>;
}

export interface QueryResult {
    data: any;
    type: 'chart' | 'text' | 'table';
    metadata?: Record<string, any>;
} 