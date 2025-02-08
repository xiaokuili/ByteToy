"use server"

import { and, like, eq } from "drizzle-orm";
import db from "@/lib/drizzle"
import { dataSources } from "@/schema"


// 获取数据后续需要重写，基于不同的类型提供不同的方式
export async function getDataSources() {
    // Get all active data sources
    const sources = await db.select({
      id: dataSources.id,
      name: dataSources.name,
      category: dataSources.category,
      description: dataSources.description,
      input: dataSources.input,
      output: dataSources.output,
      tags: dataSources.tags,
      status: dataSources.status
    })
    .from(dataSources)
    .where(eq(dataSources.status, 'active'));
  
    return sources;
  }
  
  
  export async function getDataSourcesByName(name: string) {
      // Get active data sources matching the name
      const sources = await db.select({
        id: dataSources.id,
        name: dataSources.name, 
        category: dataSources.category,
        description: dataSources.description,
        input: dataSources.input,
        output: dataSources.output,
        tags: dataSources.tags,
        status: dataSources.status
      })
      .from(dataSources)
      .where(
          and(
            eq(dataSources.status, 'active'),
            like(dataSources.name, `%${name}%`)
          )
        );
    
      return sources;
    }