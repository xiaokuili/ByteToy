'use client'

import { useState, useCallback } from 'react';
import { saveDatasourceToDB, getDatasourceByName as getDatasourceByNameFromDB ,initDatasource} from '@/actions/datasource';
import { DataSource } from '@/lib/types';
import { fetchCreateTableSQL } from '@/actions/datasource';


// TODO： 文件上传业务不清晰，datasource 应该如何展示 
// 1. 初始化文件系统，最好一个上传 ，一个展示？我还不清楚 ， 或者是否从数据库获取 ？
// 2. 沟通场景  
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
        if (typeof window === 'undefined') return null;
        
        const cached = localStorage.getItem(`datasource_${name}`);
        if (cached) {
            return JSON.parse(cached) as DataSource;
        }
        return null;
    }, []);


    const clearLocalStorage = useCallback(() => {
        if (typeof window === 'undefined') return;
        
        // Clear only datasource_ prefixed items
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('datasource_')) {
                localStorage.removeItem(key);
            }
        }
    }, []);

    // TODO: 目前只能获取一个datasource
    const getAllDatasources = useCallback(() => {
        const dataSources: DataSource[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('datasource_')) {
                const value = localStorage.getItem(key);
                if (value) {
                    const parsedValue = JSON.parse(value);
                    dataSources.push(parsedValue);
                }
            }
        }
        if (dataSources.length > 0) {
            setDataSource(dataSources[dataSources.length - 1]); // Set the last datasource as current
        }
        return dataSources.length > 0 ? dataSources[dataSources.length - 1] : null;
    }, []);


    return {
        dataSource,

        saveDatasource,
        getDatasourceByName,

        getDatasourceFromLocalStorage,
        getAllDatasources,
        clearLocalStorage
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
    
    // 解析数据行并转换为带表头的对象数组
    const rows = lines.slice(1).map(line => {
        const cells = line.split(',').map(cell => cell.trim());
        // 检查数据行的列数是否与表头一致
        if (cells.length !== headers.length) {
            throw new Error(`CSV文件格式错误：第 ${lines.indexOf(line) + 2} 行的列数与表头不一致`);
        }
        
        // 将每行数据转换为带表头的对象
        return headers.reduce((obj, header, i) => {
            obj[header] = cells[i] || '';
            return obj;
        }, {} as Record<string, string>);
    });

    
    // 使用文件名作为表名，移除.csv后缀并替换特殊字符
    const fileName = file.name.toLowerCase().replace('.csv', '').replace(/[^a-z0-9_]/g, '_');
    const tableName = `ds_${fileName}`;
    
    // 提取示例数据（前5行）
    const exampleData = rows.slice(0, 5)
        .map(obj => JSON.stringify(obj))
        .join('\n');

    
    // 生成唯一ID
    const id = `ds_${Date.now()}`;
    const createTableSQL = await fetchCreateTableSQL(id, tableName, {
        id: id,
        name: tableName,
        description: `从文件 ${file.name} 导入的数据，包含 ${headers.length} 列和 ${rows.length} 行数据。`,
        example_data: exampleData,
        special_fields: ""
    });

    await initDatasource(createTableSQL, tableName, rows);

    return {
        id,
        name: tableName,
        description: `从文件 ${file.name} 导入的数据，包含 ${headers.length} 列和 ${rows.length} 行数据。`,
        schema: createTableSQL,
        example_data: exampleData,
        special_fields: ""
    };
};