"use server";

import { prisma } from "@/lib/prisma";
import { Datasource  } from "@/types/base";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import {Schema} from "@/types/base"
interface ConnectionResult {

  success: boolean;
  error?: string;
  schemas?: Record<
    string,
    {
      tables: Array<{
        name: string;
        columns: Array<{
          name: string;
          type: string;
        }>;
      }>;
    }
  >;
}
// 构建连接字符串
function buildConnectionString(datasource: Datasource): string {
  const { type, host, port, databaseName, username, password, useSSL } =
    datasource;

  switch (type.toLowerCase()) {
    case "postgresql":
      return `postgresql://${username}:${password}@${host}:${port}/${databaseName}?sslmode=disable`;

   
    // 可以添加其他数据库类型
    default:
      throw new Error(`Unsupported database type: ${type}`);
  }
}

export async function checkConnection(
  datasource: Datasource,
): Promise<ConnectionResult> {
  // 构建连接字符串
  const connectionString = buildConnectionString(datasource);
  let testClient: PrismaClient | null = null;

  try {
    testClient = new PrismaClient({
      datasources: {
        db: {
          url: connectionString,
        },
      },
    });

    // 测试连接
    await testClient.$connect();

    // 根据数据库类型获取表结构
    const schemas = await introspectDatabase(testClient, datasource);

    return {
      success: true,
      schemas,
    };
  } catch (error) {
    console.error("Database connection failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  } finally {
    if (testClient) {
      await testClient.$disconnect();
    }
  }
}

interface PostgresColumn {
  schema: string;
  table: string;
  column: string;
  type: string;
  nullable: string;
}
async function introspectDatabase(
  client: PrismaClient,
  datasource: Datasource,
): Promise<Record<string, any>> {
  const { type, schemas: targetSchemas } = datasource;

  try {
    switch (type.toLowerCase()) {
      case "postgresql": {
        // 构建 schema 过滤条件
        const schemaFilter =
          targetSchemas === "All"
            ? "AND table_schema = 'public'"
            : `AND table_schema IN (${targetSchemas.map((s) => `'${s}'`).join(",")})`;

        const query = `
          SELECT 
            table_schema as "schema",
            table_name as "table",
            column_name as "column",
            data_type as "type",
            is_nullable as "nullable"
          FROM information_schema.columns 
          WHERE table_catalog = $1
          ${schemaFilter}
          ORDER BY table_schema, table_name, ordinal_position
        `;

       
        const tables = await client.$queryRawUnsafe(query, datasource.databaseName) as PostgresColumn[];


        return formatPostgresStructure(tables);
      }

      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  } catch (error) {
    console.error("Failed to introspect database:", error);
    throw error;
  }
}
function formatPostgresStructure(rawData: any[]): Record<string, Schema> {
  const schemas: Record<string, Schema> = {};

  // 按 schema 和 table 分组处理数据
  rawData.forEach((row) => {
    const schemaName = row.schema;
    const tableName = row.table;

    // 初始化 schema 如果不存在
    if (!schemas[schemaName]) {
      schemas[schemaName] = {
        name: schemaName,
        tables: [],
      };
    }

    // 查找当前表
    let table = schemas[schemaName].tables.find((t) => t.name === tableName);

    // 如果表不存在，创建新表
    if (!table) {
      table = {
        name: tableName,
        columns: [],
      };
      schemas[schemaName].tables.push(table);
    }

    // 添加列信息
    table.columns.push({
      name: row.column,
      type: row.type,
      nullable: row.nullable === "YES",
      comment: row.comment || undefined,
      key: row.key || undefined,
    });
  });

  return schemas;
}

export async function createMetadata(data: Datasource) {
  try {
    const metadata = await prisma.metadata.create({
      data: {
        ...data,
        schemas: JSON.stringify(data.schemas),
      },
    });

    revalidatePath("/metadata");
    return { success: true, data: metadata };
  } catch (error) {
    console.error("Failed to create metadata:", error);
    return {
      success: false,
      error: "Failed to create metadata",
    };
  }
}

export async function getMetadatas() {
  try {
    const metadatas = await prisma.metadata.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: metadatas.map((meta:Datasource) => ({
        ...meta,
        schemas: JSON.parse(meta.schemas as string),
      })),
    };
  } catch (error) {
    console.error("Failed to fetch metadatas:", error);
    return {
      success: false,
      error: "Failed to fetch metadatas",
    };
  }
}

export async function getMetadata(id: string) {
  try {
    const metadata = await prisma.metadata.findUnique({
      where: { id },
    });

    if (!metadata) {
      return {
        success: false,
        error: "Metadata not found",
      };
    }

    return {
      success: true,
      data: {
        ...metadata,
        schemas: JSON.parse(metadata.schemas as string),
      },
    };
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    return {
      success: false,
      error: "Failed to fetch metadata",
    };
  }
}

export async function updateMetadata(id: string, data: Partial<Datasource>) {
  try {
    const metadata = await prisma.metadata.update({
      where: { id },
      data: {
        ...data,
        ...(data.schemas && { schemas: JSON.stringify(data.schemas) }),
      },
    });

    revalidatePath("/metadata");
    return { success: true, data: metadata };
  } catch (error) {
    console.error("Failed to update metadata:", error);
    return {
      success: false,
      error: "Failed to update metadata",
    };
  }
}

export async function deleteMetadata(id: string) {
  try {
    await prisma.metadata.delete({
      where: { id },
    });

    revalidatePath("/metadata");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete metadata:", error);
    return {
      success: false,
      error: "Failed to delete metadata",
    };
  }
}
