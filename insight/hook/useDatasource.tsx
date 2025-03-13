'use client'

import { useState, useCallback } from 'react';
import { saveDatasourceToDB, getDatasourceByName as getDatasourceByNameFromDB ,executeSQL} from '@/actions/datasource';
import { DataSource } from '@/lib/types';

export function useDatasource() {
    const [dataSource, setDataSource] = useState<DataSource | null>();

    const saveDatasource = useCallback(async (file: File) => {
        let err: Error | null = null;
        
        try {
            // 读取文件内容
            const content = await file.text();
            
            // 将文件内容提取，并存储到数据库
            const dataSource = await processFileContent(content, file);
            
            // 保存到数据库
            const result = await saveDatasourceToDB(dataSource);
            
            // Save to localStorage
            localStorage.setItem(`datasource_${dataSource.name}`, JSON.stringify(result));
            setDataSource(result as DataSource);
            return { loading: false, error: err, dataSource: dataSource };
        } catch (error) {
            err = error instanceof Error ? error : new Error('Unknown error');
            return { loading: false, error: err, dataSource: null };
        } 
    }, []);

    const getDatasourceByName = useCallback(async (name: string) => {
        let err: Error | null = null;
        
        try {
            // Try to get from localStorage first
            const cached = localStorage.getItem(`datasource_${name}`);
            if (cached) {
                const parsedCache = JSON.parse(cached);
                setDataSource(parsedCache);
                return { loading: false, error: err, dataSource: parsedCache };
            }
            
            // If not in cache, get from database
            const result = await getDatasourceByNameFromDB(name);
            
            // Save to localStorage
            localStorage.setItem(`datasource_${name}`, JSON.stringify(result));
            setDataSource(result as DataSource);
            return { loading: false, error: err, dataSource: result };
        } catch (error) {
            err = error instanceof Error ? error : new Error('Unknown error');
            return { loading: false, error: err, dataSource: null };
        } 
    }, []);

    const getDatasourceFromLocalStorage = useCallback((name: string) => {
        const cached = localStorage.getItem(`datasource_${name}`);
        if (cached) {
            return JSON.parse(cached) as DataSource;
        }
        return null;
    }, []);

    return {
        dataSource,

        saveDatasource,
        getDatasourceByName,

        getDatasourceFromLocalStorage
    };
}


 // 处理文件内容并补全字段
 const processFileContent = async (content: string, file: File): Promise<DataSource> => {
    // 检查是否是CSV文件
    if (!content.includes(',')) {
        throw new Error('文件格式错误：请上传包含逗号分隔值的CSV文件');
    }

    // 解析CSV内容
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // 检查是否有足够的行
    if (lines.length < 2) {
        throw new Error('CSV文件格式错误：文件至少需要包含表头和一行数据');
    }
    
    // 获取表头
    const headers = lines[0].split(',').map(h => h.trim());
    
    // 检查表头是否为空
    if (headers.length === 0) {
        throw new Error('CSV文件格式错误：未检测到表头');
    }
    
    // 检查表头是否有空值
    if (headers.some(h => !h)) {
        throw new Error('CSV文件格式错误：表头中存在空列名');
    }
    
    // 检查表头是否有重复
    const uniqueHeaders = new Set(headers);
    if (uniqueHeaders.size !== headers.length) {
        throw new Error('CSV文件格式错误：表头中存在重复的列名');
    }
    
    const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
    
    // 检查数据行的列数是否与表头一致
    const invalidRows = rows.findIndex(row => row.length !== headers.length);
    if (invalidRows !== -1) {
        throw new Error(`CSV文件格式错误：第 ${invalidRows + 2} 行的列数与表头不一致`);
    }

    // 生成建表语句
    // 处理特殊字符，将中文括号替换为英文括号，移除空格
    const sanitizeHeader = (header: string) => {
        return header
            .replace(/[（]/g, '(')
            .replace(/[）]/g, ')')
            .replace(/\s+/g, '_');
    };

    const columnDefs = headers.map(header => `"${sanitizeHeader(header)}" TEXT`).join(', ');
    
    // 使用文件名作为表名，移除.csv后缀并替换特殊字符
    const fileName = file.name.toLowerCase().replace('.csv', '').replace(/[^a-z0-9_]/g, '_');
    const tableName = `ds_${fileName}`;
    
    const createTableSQL = `CREATE TABLE IF NOT EXISTS "${tableName}" (${columnDefs}) WITH (OIDS=FALSE);`;

    // 提取示例数据（前5行）
    const exampleData = rows.slice(0, 5)
        .map(row => headers.reduce((obj, header, i) => {
            obj[header] = row[i] || '';
            return obj;
        }, {} as Record<string, string>))
        .map(obj => JSON.stringify(obj))
        .join('\n');

    // 生成唯一ID
    const id = `ds_${Date.now()}`;

    await executeSQL(createTableSQL, tableName, rows);

    return {
        id,
        name: tableName,
        description: `从文件 ${file.name} 导入的数据，包含 ${headers.length} 列和 ${rows.length} 行数据。`,
        schema: createTableSQL,
        example_data: exampleData,
        special_fields: headers.map(h => `${h}: ${h}`).join('\n')
    };
};