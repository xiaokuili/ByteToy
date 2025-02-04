import { pgTable, text, json, timestamp, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const templates = pgTable('templates', {
    id: text('id').primaryKey().notNull(),
    title: text('title').notNull(),
    type: text('type').notNull(),
    variables: json('variables').notNull(),
    dataConfig: json('data_config').notNull(),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    nextId: text('next_id'),
    level: integer('level').default(0).notNull(),
});

export const dataSources = pgTable('data_sources', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  category: text('category').notNull(), // 'rag' | 'api' | 'database'
  description: text('description').notNull(),
  input: json('input').notNull(), // { name: string, type: string, required: boolean }[]
  output: json('output').notNull(), // { name: string, type: string }[]
  example: json('example').notNull(),
  config: json('config'), // Optional config info
  version: text('version').notNull(),
  status: text('status').notNull(), // 'active' | 'deprecated' | 'testing'
  tags: json('tags').notNull().$type<string[]>(),
  usageCount: integer('usage_count').default(0).notNull(),
  lastUsed: timestamp('last_used').default(sql`CURRENT_TIMESTAMP`).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull()
});
