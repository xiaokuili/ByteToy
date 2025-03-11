import { drizzle } from 'drizzle-orm/node-postgres';


// Create postgres connection
export const db = drizzle(process.env.DATABASE_URL!);


export interface DBConfig {
    host: string;      // 数据库主机
    port: number;      // 端口号
    user: string;      // 用户名
    password: string;  // 密码
    database: string;  // 数据库名
    schema: string;    // 数据库模式
    engine: string;    // 数据引擎类型
}


// TODO: 迁移到datasource模块
export function createConnection() {
    // 根据配置创建连接
    // 例如：不同类型的数据库(MySQL, PostgreSQL等)
    // 不同的连接参数(主机、端口、凭证等)

    return db;
}