import { sql } from 'drizzle-orm';
import { jsonb, pgTable, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const datasources = pgTable('datasources', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
    schema: text('schema').notNull(),
    example_data: text('example_data'),
    special_fields: text('special_fields'),
    // 使用 sql.now() 设置默认值
    created_at: timestamp('created_at', { mode: 'date' })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    // 使用触发器自动更新
    updated_at: timestamp('updated_at', { mode: 'date' })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull()
});



// TODO : 1. 在 /Users/root1/mycode/ByteToy/insight/actions 中实现dataflowConfig 的数据库操作
// 2. 在/Users/root1/mycode/ByteToy/insight/hook中实现 dataflow 存储的hook ，注意 /Users/root1/mycode/ByteToy/insight/hook/useDataFlow.tsx 是对整个dataflow操作的描述， 不是数据库存储的描述， 请你添加到合适的文件中
// 
export const dataflowConfig = pgTable('dataflow_config', {
    id: varchar('id', { length: 256 }).notNull(),    // 数据流id
    name: varchar('name', { length: 256 }).notNull(), // 用户搜索语句，如果多次搜索，合并name 
    datasourceId: varchar('datasource_id', { length: 256 }).notNull(), // 数据源id
    sql: text('sql'), // 生成的sql语句

    // 图表配置
    chartType: varchar('chart_type', { length: 256 }).notNull(), // 图表类型
    chartConfig: jsonb('chart_config'),
    chartFramework: varchar('chart_framework', { length: 256 }).notNull(), // 使用框架

    // 用户和权限
    createdBy: varchar('created_by', { length: 256 }).notNull(),
    updatedBy: varchar('updated_by', { length: 256 }),

    // 时间戳
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    // 状态
    status: varchar('status', { length: 50 }).default('draft').notNull(), // draft, published, archived

});
