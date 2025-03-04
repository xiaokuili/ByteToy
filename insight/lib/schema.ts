import { pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const datasources = pgTable('datasources', {
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description'),
    schema: text('schema'),
    example_data: text('example_data'),
    special_fields: text('special_fields')
});