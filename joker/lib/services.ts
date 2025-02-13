"use server"

import db from "@/lib/drizzle";
import { reportConfig } from "@/schema";
import { eq } from "drizzle-orm";
import { OutlineConfig, ContentSource, GenerationSettings } from "@/types/report";

export const loadOutlineFromDb = async (id: string): Promise<OutlineConfig[]> => {
    const items = await db.select()
        .from(reportConfig)
        .where(eq(reportConfig.reportId, id))
        .orderBy(reportConfig.createdAt);

    return items.map(item => ({
        id: item.id,
        reportId: item.reportId,
        title: item.title,
        depth: item.level,
        nextNodeId: item.nextId,
        contentSources: item.dataConfig as ContentSource[],
        generationSettings: item.generateConfig as GenerationSettings
    }));
}

export const saveOutlineToDb = async (outline: OutlineConfig, reportId: string): Promise<void> => {
    await db.insert(reportConfig).values({
        id: outline.id,
        reportId,
        title: outline.title,
        type: "",
        params: {},
        dataConfig: outline.contentSources,
        generateConfig: outline.generationSettings
    });
}

export const deleteOutlineFromDb = async (reportId: string): Promise<void> => {
    await db.delete(reportConfig).where(eq(reportConfig.reportId, reportId));
}