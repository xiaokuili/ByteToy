"use server"
import { db } from '@/lib/db';
import { dataflowConfig } from '@/lib/schema';
import { eq } from 'drizzle-orm';


type Status = 'draft' | 'published' | 'archived';
type chartFramework = 'recharts';

export type DataflowConfigInput = {
    id: string
    name: string;
    datasourceId: string;
    sql?: string;
    chartType: string;
    chartConfig?: any;
    chartFramework: chartFramework;
    createdBy: string;
    updatedBy?: string;
    status?: Status;
};

export type DataflowConfigUpdateInput = Partial<Omit<DataflowConfigInput, 'createdBy'>> & {
    updatedBy: string;
};

// Create a new dataflow configuration
export async function createDataflowConfig(data: DataflowConfigInput) {

    const result = await db.insert(dataflowConfig).values({
        id: data.id,
        name: data.name,
        datasourceId: data.datasourceId,
        sql: data.sql,
        chartType: data.chartType,
        chartConfig: data.chartConfig,
        chartFramework: data.chartFramework,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy || data.createdBy,
        status: data.status || 'draft' as Status,
    }).returning();

    return result[0];
}

// Get a dataflow configuration by ID
export async function getDataflowConfigById(id: string) {
    const result = await db.select().from(dataflowConfig).where(eq(dataflowConfig.id, id));
    return result[0] || null;
}

// Get all dataflow configurations
export async function getAllDataflowConfigs() {
    return await db.select().from(dataflowConfig);
}

// Get dataflow configurations by user
export async function getDataflowConfigsByUser(userId: string) {
    return await db.select().from(dataflowConfig).where(eq(dataflowConfig.createdBy, userId));
}

// Update a dataflow configuration
export async function updateDataflowConfig(id: string, data: DataflowConfigUpdateInput) {
    const result = await db.update(dataflowConfig)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(dataflowConfig.id, id))
        .returning();

    return result[0];
}

// Delete a dataflow configuration
export async function deleteDataflowConfig(id: string) {
    await db.delete(dataflowConfig).where(eq(dataflowConfig.id, id));
}

// Change dataflow status
export async function changeDataflowStatus(id: string, status: string, updatedBy: string) {
    const result = await db.update(dataflowConfig)
        .set({
            status,
            updatedBy,
            updatedAt: new Date(),
        })
        .where(eq(dataflowConfig.id, id))
        .returning();

    return result[0];
} 