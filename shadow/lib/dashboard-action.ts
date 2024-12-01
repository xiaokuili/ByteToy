"use server";

import { prisma } from "@/lib/prisma";
import { DashboardSection, Layout } from "@/types/base";
import { revalidatePath } from "next/cache";

export async function saveDashboard(dashboardId: string, sections: DashboardSection[], layouts: Layout[]) {
  try {
    // Create/update dashboard sections in a transaction
    await prisma.$transaction(async (tx) => {
      for (const section of sections) {
        await tx.dashboard.upsert({
          where: {
            dashboardId_id: {
              dashboardId: dashboardId,
              id: section.id
            }
          },
          create: {
            dashboardId: dashboardId,
            id: section.id,
            viewMode: section.viewMode,
            llmConfig: section.llmConfig || null,
            layout: layouts.find(l => l.i === section.id) || {},
            visualizationId: section.viewId
          },
          update: {
            viewMode: section.viewMode,
            llmConfig: section.llmConfig || null,
            layout: layouts.find(l => l.i === section.id) || {},
            visualizationId: section.viewId
          }
        });
      }
    });

    revalidatePath(`/dashboard/${dashboardId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to save dashboard:", error);
    return {
      success: false,
      error: "Failed to save dashboard"
    };
  }
}
export async function getDashboard(dashboardId: string) {
  try {
    const sections = await prisma.dashboard.findMany({
      where: {
        dashboardId: dashboardId
      },
      include: {
        visualization: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    if (!sections.length) {
      return {
        success: true,
        data: {
          sections: [],
          layouts: []
        }
      };
    }

    const formattedSections: DashboardSection[] = sections.map(section => ({
      id: section.id,
      viewId: section.visualizationId || '',
      viewMode: section.viewMode,
      llmConfig: section.llmConfig as any,
      sqlContent: section.visualization?.sqlContent || '',
      sqlVariables: section.visualization?.sqlVariables as any || [],
      databaseId: section.visualization?.databaseId || '',
      isExecuting: false
    }));

    return {
      success: true,
      data: {
        sections: formattedSections,
        layouts: sections.map(s => s.layout as Layout)
      }
    };

  } catch (error) {
    console.error("Failed to fetch dashboard:", error);
    return {
      success: false,
      error: "Failed to fetch dashboard"
    };
  }
}

export async function deleteDashboardSection(dashboardId: string, sectionId: string) {
  try {
    await prisma.dashboard.delete({
      where: {
        dashboardId_id: {
          dashboardId: dashboardId,
          id: sectionId
        }
      }
    });

    revalidatePath(`/dashboard/${dashboardId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete dashboard section:", error);
    return {
      success: false,
      error: "Failed to delete dashboard section"
    };
  }
}
