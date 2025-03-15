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
            description: data.description || '',
            schema: data.schema || '',
            example_data: data.example_data || '',
            special_fields: data.special_fields || ''
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


/**
 * 从API获取SQL查询结果
 */
export async function fetchCreateTableSQL(flowId: string, query: string, datasource: DataSource) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate/schema`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`},
        body: JSON.stringify({ user_input: query, datasource: datasource, session_id: flowId })
    });
    if (!response.ok) {
        throw new Error(`Schema generation failed: ${await response.text()}`);
    }

    const result = await response.json();
    return result.create_sql_result.create_table_sql;
}


export async function executeSQL(sql: string, tableName: string, rows: Record<string, string>[]) {
    const datasourceDB = drizzle(process.env.DATABASE_URL! as string)

    // Execute the CREATE TABLE statement
    await datasourceDB.execute(sql);

   
    if (!tableName) {
        throw new Error('Invalid CREATE TABLE statement');
    }

    // Get column names from the CREATE TABLE statement
    // Extract column names directly from the first row of data
    const columns = Object.keys(rows[0] || {});
    
    // Sanitize column names for SQL query
    const sanitizedColumns = columns.map(col => `"${col.trim().replace(/"/g, '')}"`);

    // Insert rows one by one
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        // Extract values in the same order as sanitizedColumns
        const values = sanitizedColumns.map(col => {
            // Remove quotes from column name to match object keys
            const colName = col.replace(/"/g, '');
            // Escape single quotes in the value and wrap in quotes
            return `'${(row[colName] || '').replace(/'/g, "''")}'`;
        }).join(', ');
        
        const insertSQL = `
            INSERT INTO "${tableName}" (${sanitizedColumns.join(', ')})
            VALUES (${values})
        `;
        console.log(insertSQL)
        
        await datasourceDB.execute(insertSQL);
    }

    return {
        tableName,
        rowCount: rows.length
    };
}


