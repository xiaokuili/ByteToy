"use server";

import { prisma } from "@/lib/prisma";
import { Variable } from "@/types/base";


interface CreateVisualizationInput {
  name: string;
  datasourceId: string;
  sqlContent: string;
  viewMode: string;
  viewParams: Record<string, unknown>;
  sqlVariables: Variable[];
}

interface UpdateVisualizationInput extends Partial<CreateVisualizationInput> {
  id: string;
}

export async function createVisualization(input: CreateVisualizationInput) {
  return prisma.visualization.create({
    data: {
      name: input.name,
      datasourceId: input.datasourceId,
      sqlContent: input.sqlContent,
      viewMode: input.viewMode,
      viewParams: input.viewParams,
      sqlVariables: input.sqlVariables,
    },
  });
}

export async function getVisualization(id: string) {
  return prisma.visualization.findUnique({
    where: { id },
  });
}

export async function listVisualizations() {
  return prisma.visualization.findMany();
}

export async function updateVisualization(input: UpdateVisualizationInput) {
  const { id, ...data } = input;
  return prisma.visualization.update({
    where: { id },
    data,
  });
}

export async function deleteVisualization(id: string) {
  return prisma.visualization.delete({
    where: { id },
  });
}
