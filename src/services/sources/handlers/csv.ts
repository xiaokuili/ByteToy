import { Source, SourceHandler, SourceType, QueryResult } from '../types';
import * as fs from 'fs/promises';
import * as csv from 'csv-parse';

export class CSVSourceHandler implements SourceHandler {
    type = SourceType.CSV;

    canHandle(source: Source): boolean {
        return source.type === SourceType.CSV;
    }

    async query(source: Source, query: string): Promise<QueryResult> {
        // 读取CSV文件
        const content = await fs.readFile(source.path, 'utf-8');

        // 解析CSV数据
        const records = await new Promise((resolve, reject) => {
            csv.parse(content, {
                columns: true,
                skip_empty_lines: true
            }, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });

        // 这里可以添加SQL查询转换逻辑
        // 目前返回简单的表格数据
        return {
            data: records,
            type: 'table'
        };
    }
} 