"use server";

import { prisma } from "@/lib/prisma";
import { Variable } from "@/types/base";

interface CreateVisualizationInput {
  id: string;
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

interface PaginationParams {
  page: number;
  pageSize: number;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function createVisualization(input: CreateVisualizationInput) {
  return prisma.visualization.create({
    data: {
      id: input.id,
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

export async function listVisualizations(
  params?: PaginationParams
): Promise<PaginatedResult<Visualization>> {
  const { page = 1, pageSize = 10 } = params || {};
  const skip = (page - 1) * pageSize;

  const [total, items] = await Promise.all([
    prisma.visualization.count(),
    prisma.visualization.findMany({
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    data: items,
    total,
    page,
    pageSize,
    totalPages,
  };
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
