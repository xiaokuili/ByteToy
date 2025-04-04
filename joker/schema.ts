import { pgTable, text, json, timestamp, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const reportConfig = pgTable('report_config', {
    id: text('id').primaryKey().notNull(),
    reportId: text('report_id').notNull(), // Foreign key to reports table
    title: text('title').notNull(),
    type: text('type').notNull(), // 'title' | 'ai-text' | 'line-chart' etc
    params: json('params').notNull(), // Template parameters
    dataConfig: json('data_config').array().notNull().default(sql`'{}'::jsonb[]`), // Array of {id: string, name: string, url: string}
    generateConfig: json('generate_config').notNull(), // Generation parameters
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    nextId: text('next_id'), // For ordering items within a report
    level: integer('level').default(0).notNull(), // Heading level/hierarchy
});
