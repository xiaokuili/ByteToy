"use server";

import { prisma } from "@/lib/prisma";
import { Datasource } from "@/types/base";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { Schema } from "@/types/base";

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
// todo: 添加缓存
export async function executeQuery(datasourceId: string, sql: string) {
  try {
    // 1. 获取数据源信息
    const metadataResult = await getMetadata(datasourceId);
    if (!metadataResult.success || !metadataResult.data) {
      console.error("Failed to get metadata:", metadataResult.error);
      return {
        success: false,
        error: "Failed to get datasource information",
      };
    }

    const datasource = metadataResult.data;
    const connectionString = buildConnectionString(datasource);

    // 2. 创建数据库连接
    const queryClient = new PrismaClient({
      datasources: {
        db: {
          url: connectionString,
        },
      },
    });

    try {
      // 3. 执行查询
      const result =
        await queryClient.$queryRawUnsafe<Record<string, unknown>[]>(sql);
      // 改进格式化逻辑
      const formattedRows = result.map((row) => {
        const formattedRow: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(row)) {
          // 首先处理 null/undefined
          if (value === null || value === undefined) {
            formattedRow[key] = value;
            continue;
          }

          // 安全地检查 Decimal 类型
          if (
            typeof value === "object" &&
            value !== null &&
            "toFixed" in value
          ) {
            formattedRow[key] = value.toString();
          }
          // Date 对象
          else if (value instanceof Date) {
            formattedRow[key] = value.toISOString();
          }
          // 其他类型直接赋值
          else {
            formattedRow[key] = value;
          }
        }
        return formattedRow;
      });
      // 改进列类型检测
      const columns =
        result && result.length > 0
          ? Object.entries(result[0]).map(([key, value]) => {
              let type = "unknown";

              if (value === null || value === undefined) {
                type = "unknown";
              }
              // 安全地检查 Decimal 类型
              else if (
                typeof value === "object" &&
                value !== null &&
                "toFixed" in value
              ) {
                type = "decimal";
              } else if (value instanceof Date) {
                type = "datetime";
              } else {
                type = typeof value;
              }

              return {
                name: key,
                type,
              };
            })
          : [];

      return {
        success: true,
        data: {
          rows: formattedRows,
          columns,
          rowCount: result?.length || 0,
        },
      };
    } catch (queryError) {
      return {
        success: false,
        error:
          queryError instanceof Error
            ? queryError.message
            : "Query execution failed",
      };
    } finally {
      // 5. 关闭连接
      await queryClient.$disconnect();
    }
  } catch (error) {
    console.error("Query execution failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Query execution failed",
    };
  }
}

// 构建连接字符串
function buildConnectionString(datasource: Datasource): string {
  const { type, host, port, databaseName, username, password, useSSL } =
    datasource;

  switch (type.toLowerCase()) {
    case "postgresql":
      return `postgresql://${username}:${password}@${host}:${port}/${databaseName}?sslmode=require `;

    // 可以添加其他数据库类型
    default:
      throw new Error(`Unsupported database type: ${type}`);
  }
}

export async function checkConnection(
  datasource: Datasource
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
export async function introspectDatabase(
  client: PrismaClient,
  datasource: Datasource
): Promise<Record<string, Schema>> {
  const type = "postgresql";
  const targetSchemas = "All";
  try {
    switch (type.toLowerCase()) {
      case "postgresql": {
        // 构建 schema 过滤条件
        const schemaFilter =
          targetSchemas === "All"
            ? "AND table_schema = 'public'"
            : `AND table_schema IN ('${targetSchemas}')`;

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

        const tables = (await client.$queryRawUnsafe(
          query,
          datasource.databaseName
        )) as PostgresColumn[];

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
function formatPostgresStructure(
  rawData: PostgresColumn[]
): Record<string, Schema> {
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
      data: metadatas.map((meta) => ({
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
