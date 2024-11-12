import { create } from "zustand";

import { Variable } from "@/types/base";

interface VisualizationStore {
  viewMode: string;
  setViewMode: (mode: string) => void;
  datasourceId: string;
  setDatasourceId: (id: string) => void;
  sqlContent: string;
  setSqlContent: (sql: string) => void;
  sqlVariables: Variable[];
  setSqlVariables: (variables: Variable[]) => void;
}

interface VisualizationOpenStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useVisualizationOpen = create<VisualizationOpenStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));

export const useVisualization = create<VisualizationStore>((set) => ({
  viewMode: "table",
  setViewMode: (mode) => set({ viewMode: mode }),
  datasourceId: "",
  setDatasourceId: (id) => set({ datasourceId: id }),
  sqlContent: "",
  setSqlContent: (sql) => set({ sqlContent: sql }),
  sqlVariables: [],
  setSqlVariables: (variables) => set({ sqlVariables: variables }),
}));
