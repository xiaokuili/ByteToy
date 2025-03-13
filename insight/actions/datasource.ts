'use server'

import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { datasources } from '../lib/schema'
import { db } from '@/lib/db'
import { DataSource } from '@/lib/types'

export async function saveDatasourceToDB(data: DataSource) {
    const result = await db
        .insert(datasources)
        .values({
            id: data.id,
            name: data.name,
            description: data.description,
            schema: data.schema,
            example_data: data.example_data,
            special_fields: data.special_fields
        })
        .onConflictDoUpdate({
            target: [datasources.name], // Change to use name as conflict target since it has a unique constraint
            set: {
                id: data.id,
                description: data.description, 
                schema: data.schema,
                example_data: data.example_data,
                special_fields: data.special_fields
            }
        })
        .returning()

    return result[0]
}

export async function getDatasourceByName(name: string) {
    const result = await db
        .select()
        .from(datasources)
        .where(eq(datasources.name, name))
        .limit(1)

    return result[0] as DataSource
}

export async function listDatasources() {
    const result = await db
        .select()
        .from(datasources)
        .orderBy(datasources.name)

    return result as DataSource[]
}




export async function executeSQL(sql: string, tableName: string, rows: string[][]) {
    const datasourceDB = drizzle(process.env.DATABASE_URL! as string)

    // Execute the CREATE TABLE statement
    await datasourceDB.execute(sql);

   
    if (!tableName) {
        throw new Error('Invalid CREATE TABLE statement');
    }

    // Get column names from the CREATE TABLE statement
    const columnMatch = sql.match(/\((.*)\)/);
    if (!columnMatch) {
        throw new Error('Invalid CREATE TABLE statement');
    }
    
    const columns = columnMatch[1]
        .split(',')
        .map(col => col.trim().split(' ')[0]);

    // Use sanitized column names from the CREATE TABLE statement
    const sanitizedColumns = columns.map(col => `"${col.trim().replace(/"/g, '')}"`);

    // Insert rows one by one
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const values = row.map(val => `'${val.replace(/'/g, "''")}'`).join(', ');
        
        const insertSQL = `
            INSERT INTO "${tableName}" (${sanitizedColumns.join(', ')})
            VALUES (${values})
        `;
        
        await datasourceDB.execute(insertSQL);
    }

    return {
        tableName,
        rowCount: rows.length
    };
}


