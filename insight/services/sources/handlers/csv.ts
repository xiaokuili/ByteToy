import { Source, SourceHandler, SourceType, QueryResult } from '../types';
import * as fs from 'fs/promises';
import * as csv from 'csv-parse';
import path from 'path';

export class CSVSourceHandler implements SourceHandler {
    type = SourceType.CSV;

    canHandle(source: Source): boolean {
        return source.type === SourceType.CSV;
    }

    async query(source: Source, query: string): Promise<QueryResult> {
        try {
            // 确保路径是相对于项目根目录的
            const absolutePath = path.resolve(process.cwd(), source.path);
            const content = await fs.readFile(absolutePath, 'utf-8');

            const records = await new Promise((resolve, reject) => {
                csv.parse(content, {
                    columns: true,
                    skip_empty_lines: true,
                    cast: true // 自动转换数据类型
                }, (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });

            // 根据查询内容处理数据
            const processedData = await this.processQuery(records, query);

            return {
                data: processedData,
                type: this.determineResultType(query),
                metadata: {
                    source: source.id,
                    query,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            throw new Error(`Failed to process CSV source: ${error.message}`);
        }
    }

    private async processQuery(data: any[], query: string): Promise<any> {
        // TODO: 实现查询处理逻辑
        return data;
    }

    private determineResultType(query: string): 'chart' | 'text' | 'table' {
        // 基于查询内容决定返回类型
        if (query.includes('趋势') || query.includes('变化')) {
            return 'chart';
        }
        if (query.includes('列表') || query.includes('详细数据')) {
            return 'table';
        }
        return 'text';
    }
} 